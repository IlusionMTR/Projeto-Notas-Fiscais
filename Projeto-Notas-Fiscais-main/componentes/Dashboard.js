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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

  // DOWNLOAD XML
  const baixarXML = () => {
    if (!selecionado) {
      Alert.alert('Selecione uma nota primeiro');
      return;
    }

    Alert.alert('Download', `Baixando XML da nota ${selecionado.id}`);
  };

  // SOLICITAÇÕES
  const verSolicitacoes = () => {
    Alert.alert('Solicitações', 'Lista de solicitações...');
  };

  // EXPORTAR CSV
  const exportarCSV = async () => {
    try {
      await Share.share({
        message: 'Exportação CSV das notas fiscais',
      });
    } catch (error) {
      Alert.alert('Erro ao compartilhar');
    }
  };

  // RENDER DA LISTA
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

      {/* TOPBAR */}
      <View style={styles.topbar}>
        <Text style={styles.logo}>NenuxNF</Text>
      </View>

      <View style={styles.main}>

        {/* SIDEBAR */}
        <View style={styles.sidebar}>

          {/* AÇÕES */}
          <Text style={styles.sidebarTitle}>Ações</Text>

          <TouchableOpacity style={styles.actionBtn} onPress={baixarXML}>
            <Text style={styles.actionText}>⬇ Download</Text>
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

          {/* FILTROS */}
          <Text style={[styles.sidebarTitle, { marginTop: 20 }]}>
            Filtro
          </Text>

          {/* CPF */}
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={handleCpf}
            keyboardType="numeric"
            placeholder="000.000.000-00"
            placeholderTextColor="#8B949E"
          />

          {/* DATA INÍCIO */}
          <Text style={styles.label}>Data início</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowInicio(true)}
          >
            <Text style={styles.dateText}>
              {dataInicio.toLocaleDateString()}
            </Text>
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

          {/* DATA FIM */}
          <Text style={styles.label}>Data fim</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowFim(true)}
          >
            <Text style={styles.dateText}>
              {dataFim.toLocaleDateString()}
            </Text>
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

        {/* CONTEÚDO */}
        <View style={styles.content}>

          {/* HEADER */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Número</Text>
            <Text style={styles.headerCell}>Cliente</Text>
            <Text style={styles.headerCell}>Data</Text>
          </View>

          {/* LISTA */}
          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />

          {/* DETALHES */}
          {selecionado && (
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Visualização rápida</Text>

              <Text style={styles.detailsText}>
                Número: {selecionado.id}
              </Text>
              <Text style={styles.detailsText}>
                Cliente: {selecionado.cliente}
              </Text>
              <Text style={styles.detailsText}>
                Data: {selecionado.data}
              </Text>
            </View>
          )}

        </View>
      </View>
    </SafeAreaView>
  );
}