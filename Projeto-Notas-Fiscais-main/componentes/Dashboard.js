import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import styles from './DashboardStyles';

export default function Dashboard({ pedidos, usuarioLogado, onLogout, onAtualizar, onDeletar }) {
  const [selecionado, setSelecionado] = useState(null);
  const [cpfFiltro, setCpfFiltro] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  // --- FILTRAGEM APENAS POR CPF ---
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      return pedido.cpf.includes(cpfFiltro);
    });
  }, [pedidos, cpfFiltro]);

  const limparFiltros = () => {
    setCpfFiltro('');
    setSelecionado(null);
  };

  const handleCpf = (text) => {
    let cpfNumeros = text.replace(/\D/g, '').slice(0, 11);
    cpfNumeros = cpfNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpfFiltro(cpfNumeros);
  };

  const getCorStatus = (status) => {
    switch (status) {
      case 'Cancelado': return '#F85149';
      case 'Pendente': return '#D29922';
      case 'Emitida': return '#3FB950';
      default: return '#C9D1D9';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, selecionado?.id === item.id && styles.rowSelecionada]}
      onPress={() => setSelecionado(item)}
    >
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]} numberOfLines={1}>{item.cliente}</Text>
      <Text style={styles.cell}>{item.cpf}</Text>
      <Text style={styles.cell}>{item.data}</Text>
      {/* Exibe apenas o primeiro nome do produto */}
      <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
        {item.produto.split(' ')[0]}
      </Text>
      <Text style={styles.cell}>{item.valor}</Text>
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
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("XML", "Gerando nota...")}>
            <Text style={styles.actionText}>⬇ Download XML</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📄 Visualizar Nota</Text>
          </TouchableOpacity>

          <Text style={[styles.sidebarTitle, { marginTop: 25 }]}>Filtro</Text>
          
          <Text style={styles.label}>CPF do Cliente</Text>
          <TextInput 
            style={styles.input} 
            value={cpfFiltro} 
            onChangeText={handleCpf} 
            placeholder="000.000.000-00" 
            placeholderTextColor="#8B949E" 
            keyboardType="numeric"
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#30363D', marginTop: 20 }]} 
            onPress={limparFiltros}
          >
            <Text style={styles.buttonText}>Zerar Filtros</Text>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.profileBtn} onPress={() => setMenuAberto(!menuAberto)}>
              <Text style={styles.profileText} numberOfLines={1}>👤 {usuarioLogado?.nome || 'Perfil'}</Text>
            </TouchableOpacity>
            {menuAberto && (
              <TouchableOpacity style={[styles.actionBtn, {marginTop: 5}]} onPress={onLogout}>
                <Text style={[styles.actionText, {color: '#F85149'}]}>Sair da Conta</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>ID</Text>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>Cliente</Text>
            <Text style={styles.headerCell}>CPF</Text>
            <Text style={styles.headerCell}>Data</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Produto</Text>
            <Text style={styles.headerCell}>Valor</Text>
          </View>
          
          <FlatList 
            data={pedidosFiltrados} 
            keyExtractor={(item) => item.id.toString()} 
            renderItem={renderItem} 
            ListEmptyComponent={
              <Text style={{color: '#8B949E', textAlign: 'center', marginTop: 50}}>
                Nenhum cliente encontrado com este CPF.
              </Text>
            }
          />
          
          {selecionado && (
            <View style={styles.details}>
              <Text style={styles.detailsTitle}>Informações Adicionais</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={styles.detailsText}>Cliente: {selecionado.cliente}</Text>
                  <Text style={styles.detailsText}>CPF: {selecionado.cpf}</Text>
                </View>
                <View>
                  <Text style={styles.detailsText}>Produto: {selecionado.produto.split(' ')[0]}</Text>
                  <Text style={styles.detailsText}>
                    Status: <Text style={{ color: getCorStatus(selecionado.status), fontWeight: 'bold' }}>{selecionado.status}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}