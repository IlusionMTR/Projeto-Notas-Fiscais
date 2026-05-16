import React, { useState, useMemo, useEffect } from 'react';
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
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system'; 
import * as Sharing from 'expo-sharing'; 
import styles from './DashboardStyles';

export default function Dashboard({ pedidos, usuarioLogado, onLogout, onAtualizar, onDeletar }) {
  const [selecionado, setSelecionado] = useState(null);
  const [cpfFiltro, setCpfFiltro] = useState('');
  
  const [dataInicio, setDataInicio] = useState(new Date(2025, 0, 1));
  const [dataFim, setDataFim] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  const [menuAberto, setMenuAberto] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalDanfeVisivel, setModalDanfeVisivel] = useState(false);

  const [editNome, setEditNome] = useState(usuarioLogado?.nome || '');
  const [editEmail, setEditEmail] = useState(usuarioLogado?.email || '');
  const [editSenha, setEditSenha] = useState(usuarioLogado?.senha || '');

  useEffect(() => {
    if (usuarioLogado) {
      setEditNome(usuarioLogado.nome || '');
      setEditEmail(usuarioLogado.email || '');
      setEditSenha(usuarioLogado.senha || '');
    }
  }, [usuarioLogado]);

  const nomeEmitente = (usuarioLogado?.nome || 'EMPRESA CONFIGURADA').toUpperCase();

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const atendeCpf = pedido.cpf.includes(cpfFiltro);
      
      const [dia, mes, ano] = pedido.data.split('/');
      const dataDoPedido = new Date(ano, mes - 1, dia, 12, 0, 0);
      
      const inicio = new Date(dataInicio);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      
      const atendeData = dataDoPedido >= inicio && dataDoPedido <= fim;

      return atendeCpf && atendeData;
    });
  }, [pedidos, cpfFiltro, dataInicio, dataFim]);

  const limparFiltros = () => {
    setCpfFiltro('');
    setDataInicio(new Date(2025, 0, 1));
    setDataFim(new Date());
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

  // FUNÇÃO ATUALIZADA: Gerando o XML completo com todos os dados idênticos ao DANFE
  const baixarXML = async () => {
    if (!selecionado) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota na lista primeiro.');
      return;
    }

    // Tratamento de variáveis e fallbacks de segurança
    const valorLimpo = selecionado.valor ? selecionado.valor.replace('R$ ', '').replace(',', '.') : '0.00';
    const cnpjEmitente = usuarioLogado?.cnpj || '26.024.773/0001-00';
    const ieEmitente = usuarioLogado?.inscricaoEstadual || '189.204.998.115';
    const enderecoEmitente = usuarioLogado?.endereco || 'Tv. Henrique Kopke, 44 - Centro, Niterói';
    const chaveAcessoLimpa = selecionado.chaveAcesso ? selecionado.chaveAcesso.replace(/\D/g, '') : `352212${cnpjEmitente.replace(/\D/g, '')}55001000000${selecionado.id}123456789`;

    const xmlConteudo = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${chaveAcessoLimpa}" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <natOp>${selecionado.naturezaOperacao || 'VENDA DE MERCADORIA'}</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>${selecionado.id}</nNF>
        <dhEmi>${selecionado.data}</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>${cnpjEmitente.replace(/\D/g, '')}</CNPJ>
        <xNome>${nomeEmitente}</xNome>
        <enderEmit>
          <xLgr>${enderecoEmitente}</xLgr>
          <xMun>${usuarioLogado?.cidadeEstadoCep?.split(',')[0] || 'São Paulo'}</xMun>
          <UF>${usuarioLogado?.cidadeEstadoCep?.split(',')[1]?.trim()?.split('-')[0]?.trim() || 'SP'}</UF>
        </enderEmit>
        <IE>${ieEmitente.replace(/\D/g, '')}</IE>
      </emit>
      <dest>
        <CPF>${selecionado.cpf ? selecionado.cpf.replace(/\D/g, '') : ''}</CPF>
        <xNome>${selecionado.cliente}</xNome>
        <enderDest>
          <xLgr>${selecionado.endereco || ''}</xLgr>
          <xBairro>${selecionado.bairro || ''}</xBairro>
          <xMun>${selecionado.cidade || ''}</xMun>
          <UF>${selecionado.estado || ''}</UF>
          <CEP>${selecionado.cep ? selecionado.cep.replace(/\D/g, '') : ''}</CEP>
        </enderDest>
        <indIEDest>9</indIEDest>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>001</cProd>
          <xProd>${selecionado.produto}</xProd>
          <qCom>1.0000</qCom>
          <vUnCom>${valorLimpo}</vUnCom>
          <vProd>${valorLimpo}</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vBC>0.00</vBC>
          <vICMS>0.00</vICMS>
          <vProd>${valorLimpo}</vProd>
          <vNF>${valorLimpo}</vNF>
        </ICMSTot>
      </total>
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
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const fileUri = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.writeAsStringAsync(fileUri, xmlConteudo, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível gerar o arquivo no dispositivo.');
      }
    }
  };

  const abrirDanfe = () => {
    if (!selecionado) {
      Alert.alert("Atenção", "Selecione um cliente na tabela primeiro.");
      return;
    }
    setModalDanfeVisivel(true);
  };

  const handleSalvarPerfil = () => {
    if (!editNome || !editEmail || !editSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    onAtualizar(usuarioLogado.id, { nome: editNome, email: editEmail, senha: editSenha });
    setModalVisivel(false);
  };

  const confirmarExclusao = () => {
    setMenuAberto(false);
    if (Platform.OS === 'web') {
      const confirmou = window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");
      if (confirmou) onDeletar(usuarioLogado.id);
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja deletar sua conta?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Deletar", style: "destructive", onPress: () => onDeletar(usuarioLogado.id) }
        ]
      );
    }
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
      <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
        {item.produto.split(' ')[0]}
      </Text>
      <Text style={styles.cell}>{item.valor}</Text>
    </TouchableOpacity>
  );

  const danfe = {
    container: { backgroundColor: '#FFF', width: '100%', maxWidth: 850, padding: 10, alignSelf: 'center' },
    box: { borderWidth: 1, borderColor: '#000', marginBottom: 5 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
    rowNoBorder: { flexDirection: 'row' },
    cell: { flex: 1, borderRightWidth: 1, borderColor: '#000', padding: 4, justifyContent: 'center' },
    cellNoBorder: { flex: 1, padding: 4, justifyContent: 'center' },
    label: { fontSize: 7, color: '#000', textTransform: 'uppercase' },
    value: { fontSize: 10, color: '#000', fontWeight: 'bold' },
    sectionTitle: { fontSize: 10, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 2 }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Perfil */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Perfil</Text>
            <TextInput style={styles.input} value={editNome} onChangeText={setEditNome} placeholder="Nome" placeholderTextColor="#8B949E" />
            <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} placeholder="E-mail" placeholderTextColor="#8B949E" />
            <TextInput style={styles.input} value={editSenha} onChangeText={setEditSenha} secureTextEntry placeholder="Senha" placeholderTextColor="#8B949E" />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, {backgroundColor: '#30363D'}]} onPress={() => setModalVisivel(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSalvarPerfil}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal do DANFE */}
      <Modal visible={modalDanfeVisivel} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#30363D' }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <TouchableOpacity 
              style={{ alignSelf: 'flex-end', backgroundColor: '#F85149', padding: 10, borderRadius: 5, marginBottom: 15 }} 
              onPress={() => setModalDanfeVisivel(false)}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Fechar Visualização</Text>
            </TouchableOpacity>

            {selecionado && (
              <View style={danfe.container}>
                <View style={[danfe.box, { borderBottomWidth: 1, borderStyle: 'dashed' }]}>
                  <View style={danfe.row}>
                    <View style={danfe.cell}>
                      <Text style={danfe.label}>RECEBEMOS DE {nomeEmitente} OS PRODUTOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO</Text>
                    </View>
                    <View style={[danfe.cell, { flex: 0.3, alignItems: 'center' }]}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>NF-e</Text>
                      <Text style={danfe.value}>Nº {selecionado.id}</Text>
                    </View>
                  </View>
                </View>

                <View style={danfe.box}>
                  <View style={danfe.rowNoBorder}>
                    <View style={[danfe.cell, { flex: 1.5 }]}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>{nomeEmitente}</Text>
                      <Text style={{ fontSize: 9, color: '#000', textAlign: 'center', marginTop: 10 }}>{usuarioLogado?.endereco || 'Rua Ibitira, 8 - Vila Clementina'}</Text>
                      <Text style={{ fontSize: 9, color: '#000', textAlign: 'center' }}>{usuarioLogado?.cidadeEstadoCep || 'São Paulo, SP - CEP: 19802-329'}</Text>
                    </View>
                    <View style={[danfe.cell, { flex: 1, alignItems: 'center' }]}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>DANFE</Text>
                      <Text style={{ fontSize: 8, color: '#000', textAlign: 'center' }}>Documento Auxiliar da Nota Fiscal Eletrônica</Text>
                      <View style={{ borderWidth: 1, borderColor: '#000', padding: 5, marginTop: 5 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>1 - Saída</Text>
                      </View>
                      <Text style={[danfe.value, { marginTop: 5 }]}>Nº {selecionado.id}</Text>
                    </View>
                    <View style={[danfe.cellNoBorder, { flex: 2 }]}>
                      <Text style={danfe.label}>CHAVE DE ACESSO</Text>
                      <Text style={danfe.value}>{selecionado.chaveAcesso}</Text>
                      <Text style={{ fontSize: 8, color: '#000', textAlign: 'center', marginTop: 15 }}>Consulta de autenticidade no portal nacional da NF-e</Text>
                    </View>
                  </View>
                </View>

                <View style={danfe.box}>
                  <View style={danfe.row}>
                    <View style={[danfe.cell, { flex: 2 }]}><Text style={danfe.label}>NATUREZA DA OPERAÇÃO</Text><Text style={danfe.value}>{selecionado.naturezaOperacao}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>PROTOCOLO DE AUTORIZAÇÃO DE USO</Text><Text style={danfe.value}>135221246170 {selecionado.data}</Text></View>
                  </View>
                  <View style={danfe.rowNoBorder}>
                    <View style={danfe.cell}><Text style={danfe.label}>INSCRIÇÃO ESTADUAL</Text><Text style={danfe.value}>{usuarioLogado?.inscricaoEstadual || '189.204.998.115'}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>CNPJ</Text><Text style={danfe.value}>{usuarioLogado?.cnpj || '26.024.773/0001-00'}</Text></View>
                  </View>
                </View>

                <Text style={danfe.sectionTitle}>DESTINATÁRIO / REMETENTE</Text>
                <View style={danfe.box}>
                  <View style={danfe.row}>
                    <View style={[danfe.cell, { flex: 2 }]}><Text style={danfe.label}>NOME/RAZÃO SOCIAL</Text><Text style={danfe.value}>{selecionado.cliente}</Text></View>
                    <View style={danfe.cell}><Text style={danfe.label}>CNPJ/CPF</Text><Text style={danfe.value}>{selecionado.cpf}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>DATA DA EMISSÃO</Text><Text style={danfe.value}>{selecionado.data}</Text></View>
                  </View>
                  <View style={danfe.row}>
                    <View style={[danfe.cell, { flex: 2 }]}><Text style={danfe.label}>ENDEREÇO</Text><Text style={danfe.value}>{selecionado.endereco}</Text></View>
                    <View style={danfe.cell}><Text style={danfe.label}>BAIRRO/DISTRITO</Text><Text style={danfe.value}>{selecionado.bairro}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>CEP</Text><Text style={danfe.value}>{selecionado.cep}</Text></View>
                  </View>
                  <View style={danfe.rowNoBorder}>
                    <View style={[danfe.cell, { flex: 2 }]}><Text style={danfe.label}>MUNICÍPIO</Text><Text style={danfe.value}>{selecionado.cidade}</Text></View>
                    <View style={danfe.cell}><Text style={danfe.label}>UF</Text><Text style={danfe.value}>{selecionado.estado}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>INSCRIÇÃO ESTADUAL</Text><Text style={danfe.value}>ISENTO</Text></View>
                  </View>
                </View>

                <Text style={danfe.sectionTitle}>DADOS DO PRODUTO / SERVIÇOS</Text>
                <View style={danfe.box}>
                  <View style={[danfe.row, { backgroundColor: '#EEE' }]}>
                    <View style={[danfe.cell, { flex: 3 }]}><Text style={danfe.label}>DESCRIÇÃO</Text></View>
                    <View style={danfe.cell}><Text style={danfe.label}>QTD</Text></View>
                    <View style={danfe.cell}><Text style={danfe.label}>VLR UNIT</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.label}>VLR TOTAL</Text></View>
                  </View>
                  <View style={danfe.rowNoBorder}>
                    <View style={[danfe.cell, { flex: 3 }]}><Text style={danfe.value}>{selecionado.produto}</Text></View>
                    <View style={danfe.cell}><Text style={danfe.value}>1</Text></View>
                    <View style={danfe.cell}><Text style={danfe.value}>{selecionado.valor}</Text></View>
                    <View style={danfe.cellNoBorder}><Text style={danfe.value}>{selecionado.valor}</Text></View>
                  </View>
                </View>

                <Text style={danfe.sectionTitle}>CÁLCULO DO IMPOSTO</Text>
                <View style={danfe.box}>
                  <View style={danfe.rowNoBorder}>
                     <View style={danfe.cell}><Text style={danfe.label}>BASE DE CÁLCULO DO ICMS</Text><Text style={danfe.value}>0,00</Text></View>
                     <View style={danfe.cell}><Text style={danfe.label}>VALOR DO ICMS</Text><Text style={danfe.value}>0,00</Text></View>
                     <View style={danfe.cellNoBorder}><Text style={danfe.label}>VALOR TOTAL DOS PRODUTOS</Text><Text style={danfe.value}>{selecionado.valor}</Text></View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <View style={styles.topbar}>
        <Text style={styles.logo}>NexusNF</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Ações</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={baixarXML}>
            <Text style={styles.actionText}>⬇ Download XML</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={abrirDanfe}>
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

          <Text style={styles.label}>Data Início</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={{ backgroundColor: '#0D1117', color: '#FFF', border: '1px solid #30363D', padding: '6px', borderRadius: '6px', width: '93%', marginTop: '5px' }}
              value={dataInicio.toISOString().split('T')[0]}
              onChange={(e) => setDataInicio(new Date(e.target.value + 'T12:00:00'))}
            />
          ) : (
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowInicio(true)}>
              <Text style={{color: '#FFF'}}>{dataInicio.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.label}>Data Fim</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              style={{ backgroundColor: '#0D1117', color: '#FFF', border: '1px solid #30363D', padding: '6px', borderRadius: '6px', width: '93%', marginTop: '5px' }}
              value={dataFim.toISOString().split('T')[0]}
              onChange={(e) => setDataFim(new Date(e.target.value + 'T12:00:00'))}
            />
          ) : (
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowFim(true)}>
              <Text style={{color: '#FFF'}}>{dataFim.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
          )}

          {showInicio && <DateTimePicker value={dataInicio} mode="date" display="default" onChange={(e, date) => { setShowInicio(false); if(date) setDataInicio(date); }} />}
          {showFim && <DateTimePicker value={dataFim} mode="date" display="default" onChange={(e, date) => { setShowFim(false); if(date) setDataFim(date); }} />}

          <TouchableOpacity style={[styles.button, { backgroundColor: '#30363D', marginTop: 20 }]} onPress={limparFiltros}>
            <Text style={styles.buttonText}>Zerar Filtros</Text>
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
                  <Text style={[styles.dropdownText, {color: '#F85149'}]}>🚪 Sair da Conta</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.profileBtn} onPress={() => setMenuAberto(!menuAberto)}>
              <Text style={styles.profileText} numberOfLines={1}>👤 {usuarioLogado?.nome || 'Perfil'}</Text>
            </TouchableOpacity>
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
            ListEmptyComponent={<Text style={{color: '#8B949E', textAlign: 'center', marginTop: 50}}>Nenhum registro encontrado.</Text>}
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