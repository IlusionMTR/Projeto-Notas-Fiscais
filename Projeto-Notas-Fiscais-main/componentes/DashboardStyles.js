import { StyleSheet, Platform } from 'react-native'; // O 'Platform' faltava aqui!

export default StyleSheet.create({
  // Container Principal
  container: { 
    flex: 1, 
    backgroundColor: '#0D1117' 
  },
  
  // Barra Superior
  topbar: { 
    height: 50, 
    backgroundColor: '#161B22', 
    justifyContent: 'center', 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderColor: '#30363D' 
  },
  logo: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  
  // Layout Principal
  main: { 
    flex: 1, 
    flexDirection: 'row' 
  },
  
  // Sidebar (Barra Lateral)
  sidebar: { 
    width: 220, 
    backgroundColor: '#161B22', 
    padding: 12, 
    borderRightWidth: 1, 
    borderColor: '#30363D', 
    position: 'relative' 
  },
  sidebarTitle: { 
    color: '#58A6FF', 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  label: { 
    fontSize: 12, 
    color: '#8B949E', 
    marginTop: 10 
  },
  input: { 
    backgroundColor: '#0D1117', 
    borderWidth: 1, 
    borderColor: '#30363D', 
    padding: 8, 
    marginTop: 5, 
    borderRadius: 6, 
    color: '#FFFFFF' 
  },
  
  // Botões de Ação
  actionBtn: { 
    padding: 10, 
    backgroundColor: '#21262D', 
    marginBottom: 6, 
    borderRadius: 6 
  },
  actionText: { 
    color: '#58A6FF', 
    fontSize: 13 
  },
  button: { 
    marginTop: 15, 
    backgroundColor: '#238636', 
    padding: 10, 
    alignItems: 'center', 
    borderRadius: 6 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },
  
  // Conteúdo Central (Tabela)
  content: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#0D1117' 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#161B22', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#30363D' 
  },
  headerCell: { 
    flex: 1, 
    fontWeight: 'bold', 
    color: '#58A6FF', 
    fontSize: 13 
  },
  row: { 
    flexDirection: 'row', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#30363D' 
  },
  rowSelecionada: { 
    backgroundColor: '#1F2A3A' 
  },
  cell: { 
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: 13 
  },
  
  // Detalhes (Visualização Rápida)
  details: { 
    marginTop: 10, 
    backgroundColor: '#161B22', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#30363D', 
    borderRadius: 6 
  },
  detailsTitle: { 
    fontWeight: 'bold', 
    color: '#58A6FF', 
    marginBottom: 6 
  },
  detailsText: { 
    color: '#C9D1D9', 
    fontSize: 13 
  },
  
  // Calendário/Datas
  dateInput: { 
    backgroundColor: '#0D1117', 
    borderWidth: 1, 
    borderColor: '#30363D', 
    padding: 10, 
    marginTop: 5, 
    borderRadius: 6, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  dateText: { 
    color: '#FFFFFF' 
  },
  calendarIcon: { 
    color: '#58A6FF' 
  },

  // Perfil e Menu Dropdown (Sidebar Inferior)
  profileContainer: { 
    position: 'absolute', 
    bottom: 20, 
    left: 12, 
    right: 12 
  },
  profileBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#21262D', 
    padding: 10, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#30363D' 
  },
  profileText: { 
    color: '#FFFFFF', 
    marginLeft: 10, 
    fontSize: 13, 
    fontWeight: '600' 
  },
  dropdownMenu: { 
    backgroundColor: '#161B22', 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#30363D', 
    marginBottom: 8, 
    elevation: 5,
    overflow: 'hidden'
  },
  dropdownItem: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#30363D' 
  },
  dropdownText: { 
    color: '#C9D1D9', 
    fontSize: 13 
  },

  // Estilos do Modal de Atualização
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Platform.OS === 'web' ? 400 : '90%',
    backgroundColor: '#161B22',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
});