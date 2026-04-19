import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Share,
  Platform, // Adicionado para identificar se é Web ou Celular
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system'; // Para salvar o arquivo
import * as Sharing from 'expo-sharing'; // Para abrir a caixa de download no celular
import styles from './DashboardStyles';

export default function Dashboard({ pedidos }) {
  const [selecionado, setSelecionado] = useState(null);
  const [cpf, setCpf] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  const handleCpf = (text) => {
    let cpfNumeros = text.replace(/\D/g, '');
    cpfNumeros = cpfNumeros.slice(0, 11);
    cpfNumeros = cpfNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(cpfNumeros);
  };

  // FUNÇÃO PARA GERAR E BAIXAR O XML
  const baixarXML = async () => {
    if (!selecionado) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota na lista primeiro.');
      return;
    }

    // 1. Criamos a estrutura do XML com os dados do cliente selecionado
    const xmlConteudo = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${selecionado.id}" versao="4.00">
      <ide>
        <nNF>${selecionado.id}</nNF>
        <dhEmi>${selecionado.data}</dhEmi>
      </ide>
      <dest>
        <xNome>${selecionado.cliente}</xNome>
        <indIEDest>9</indIEDest>
      </dest>
      <total>
        <ICMSTot>
          <vNF>${selecionado.valor.replace('R$ ', '').replace(',', '.')}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;

    const fileName = `Nota_Fiscal_${selecionado.id}.xml`;

    // 2. Lógica de Download Diferenciada (Web vs Mobile)
    if (Platform.OS === 'web') {
      // No Navegador: Criamos um link temporário e "clicamos" nele automaticamente
      const blob = new Blob([xmlConteudo], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // No Celular (Android/iOS): Usamos o Sistema de Arquivos do Expo
      const fileUri = FileSystem.documentDirectory + fileName;
      
      try {
        await FileSystem.writeAsStringAsync(fileUri, xmlConteudo, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        
        // Abre as opções de compartilhamento/salvamento do celular
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível gerar o arquivo no dispositivo.');
      }
    }
  };

  const verSolicitacoes = () => {
    Alert.alert('Solicitações', 'Lista de solicitações...');
  };

  const exportarCSV = async () => {
    try {
      await Share.share({
        message: 'Exportação CSV das notas fiscais',
      });
    } catch (error) {
      Alert.alert('Erro ao compartilhar');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.row,
        selecionado?.id === item.id && styles.rowSelecionada,
      ]}
      onPress={() => setSelecionado(item)}
    >
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.cliente}</Text>
      <Text style={styles.cell}>{item.data}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.logo}>NenuxNF</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Ações</Text>

          <TouchableOpacity style={styles.actionBtn} onPress={baixarXML}>
            <Text style={styles.actionText}>⬇ Download XML</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={verSolicitacoes}>
            <Text style={styles.actionText}>📄 Solicitações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={exportarCSV}>
            <Text style={styles.actionText}>📊 Exportar CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📥 Download BI</Text>
          </TouchableOpacity>

          <Text style={[styles.sidebarTitle, { marginTop: 20 }]}>Filtro</Text>

          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={handleCpf}
            keyboardType="numeric"
            placeholder="000.000.000-00"
            placeholderTextColor="#8B949E"
          />

          <Text style={styles.label}>Data início</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowInicio(true)}>
            <Text style={styles.dateText}>{dataInicio.toLocaleDateString()}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {showInicio && (
            <DateTimePicker
              value={dataInicio}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowInicio(false);
                if (selectedDate) setDataInicio(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Data fim</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowFim(true)}>
            <Text style={styles.dateText}>{dataFim.toLocaleDateString()}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          {showFim && (
            <DateTimePicker
              value={dataFim}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowFim(false);
                if (selectedDate) setDataFim(selectedDate);
              }}
            />
          )}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Pesquisar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Número</Text>
            <Text style={styles.headerCell}>Cliente</Text>
            <Text style={styles.headerCell}>Data</Text>
          </View>

          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />

          {selecionado && (
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Visualização rápida</Text>
              <Text style={styles.detailsText}>Número: {selecionado.id}</Text>
              <Text style={styles.detailsText}>Cliente: {selecionado.cliente}</Text>
              <Text style={styles.detailsText}>Data: {selecionado.data}</Text>
              <Text style={styles.detailsText}>Valor: {selecionado.valor}</Text>
              <Text style={styles.detailsText}>Status: {selecionado.status}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}