import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import styles from './DashboardStyles';

export default function Dashboard({ pedidos, usuarioLogado, onLogout, onAtualizar, onDeletar }) {
  const [selecionado, setSelecionado] = useState(null);
  const [cpf, setCpf] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);

  const [editNome, setEditNome] = useState(usuarioLogado?.nome || '');
  const [editEmail, setEditEmail] = useState(usuarioLogado?.email || '');
  const [editSenha, setEditSenha] = useState(usuarioLogado?.senha || '');

  const handleCpf = (text) => {
    let cpfNumeros = text.replace(/\D/g, '').slice(0, 11);
    cpfNumeros = cpfNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(cpfNumeros);
  };

  const handleSalvarPerfil = () => {
    if (!editNome || !editEmail || !editSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    onAtualizar(usuarioLogado.id, { nome: editNome, email: editEmail, senha: editSenha });
    setModalVisivel(false);
  };

  // Função para confirmar exclusão
  const confirmarExclusao = () => {
    setMenuAberto(false);
    
    if (Platform.OS === 'web') {
      const confirmou = window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");
      if (confirmou) onDeletar(usuarioLogado.id);
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Deletar", style: "destructive", onPress: () => onDeletar(usuarioLogado.id) }
        ]
      );
    }
  };

  const baixarXML = async () => {
    if (!selecionado) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota na lista primeiro.');
      return;
    }

    const xmlConteudo = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${selecionado.id}" versao="4.00">
      <ide><nNF>${selecionado.id}</nNF><dhEmi>${selecionado.data}</dhEmi></ide>
      <dest><xNome>${selecionado.cliente}</xNome></dest>
      <total><ICMSTot><vNF>${selecionado.valor.replace('R$ ', '').replace(',', '.')}</vNF></ICMSTot></total>
    </infNFe>
  </NFe>
</nfeProc>`;

    const fileName = `Nota_Fiscal_${selecionado.id}.xml`;

    if (Platform.OS === 'web') {
      const blob = new Blob([xmlConteudo], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const fileUri = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.writeAsStringAsync(fileUri, xmlConteudo);
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível gerar o arquivo.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, selecionado?.id === item.id && styles.rowSelecionada]}
      onPress={() => setSelecionado(item)}
    >
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.cliente}</Text>
      <Text style={styles.cell}>{item.data}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Dados</Text>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput style={styles.input} value={editNome} onChangeText={setEditNome} />
            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} />
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput style={styles.input} value={editSenha} onChangeText={setEditSenha} secureTextEntry />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, {backgroundColor: '#30363D'}]} onPress={() => setModalVisivel(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSalvarPerfil}>
                <Text style={styles.buttonText}>Salvar e Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.topbar}>
        <Text style={styles.logo}>NenuxNF</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Ações</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={baixarXML}>
            <Text style={styles.actionText}>⬇ Download XML</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📄 Solicitações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📊 Exportar CSV</Text>
          </TouchableOpacity>

          <Text style={[styles.sidebarTitle, { marginTop: 20 }]}>Filtro</Text>
          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} value={cpf} onChangeText={handleCpf} keyboardType="numeric" placeholder="000.000.000-00" placeholderTextColor="#8B949E" />

          <Text style={styles.label}>Data início</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowInicio(true)}>
            <Text style={styles.dateText}>{dataInicio.toLocaleDateString()}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showInicio && (
            <DateTimePicker value={dataInicio} mode="date" display="default" onChange={(e, date) => { setShowInicio(false); if(date) setDataInicio(date); }} />
          )}

          <Text style={styles.label}>Data fim</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowFim(true)}>
            <Text style={styles.dateText}>{dataFim.toLocaleDateString()}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showFim && (
            <DateTimePicker value={dataFim} mode="date" display="default" onChange={(e, date) => { setShowFim(false); if(date) setDataFim(date); }} />
          )}

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Pesquisar</Text>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            {menuAberto && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuAberto(false); setModalVisivel(true); }}>
                  <Text style={styles.dropdownText}>⚙️ Atualizar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.dropdownItem} onPress={confirmarExclusao}>
                  <Text style={[styles.dropdownText, {color: '#F85149'}]}>🗑️ Deletar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.dropdownItem} onPress={onLogout}>
                  <Text style={styles.dropdownText}>🚪 Sair</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.profileBtn} onPress={() => setMenuAberto(!menuAberto)}>
              <Text style={{fontSize: 16}}>👤</Text>
              <Text style={styles.profileText} numberOfLines={1}>{usuarioLogado?.nome || 'Perfil'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Número</Text>
            <Text style={styles.headerCell}>Cliente</Text>
            <Text style={styles.headerCell}>Data</Text>
          </View>
          <FlatList data={pedidos} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
          {selecionado && (
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Visualização rápida</Text>
              <Text style={styles.detailsText}>Número: {selecionado.id}</Text>
              <Text style={styles.detailsText}>Cliente: {selecionado.cliente}</Text>
              <Text style={styles.detailsText}>Valor: {selecionado.valor}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}