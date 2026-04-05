import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },

  // TOPBAR
  topbar: {
    height: 50,
    backgroundColor: '#161B22',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#30363D',
  },

  logo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // LAYOUT PRINCIPAL
  main: {
    flex: 1,
    flexDirection: 'row',
  },

  // SIDEBAR
  sidebar: {
    width: 220,
    backgroundColor: '#161B22',
    padding: 12,
    borderRightWidth: 1,
    borderColor: '#30363D',
  },

  sidebarTitle: {
    color: '#58A6FF',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: '#8B949E',
    marginTop: 10,
  },

  input: {
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 8,
    marginTop: 5,
    borderRadius: 6,
    color: '#FFFFFF',
  },

  // BOTÕES AÇÕES
  actionBtn: {
    padding: 10,
    backgroundColor: '#21262D',
    marginBottom: 6,
    borderRadius: 6,
  },

  actionText: {
    color: '#58A6FF',
    fontSize: 13,
  },

  button: {
    marginTop: 15,
    backgroundColor: '#238636',
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // CONTEÚDO
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0D1117',
  },

  // TABELA
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#161B22',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#30363D',
  },

  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#58A6FF',
    fontSize: 13,
  },

  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#30363D',
  },

  rowSelecionada: {
    backgroundColor: '#1F2A3A',
  },

  cell: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
  },

  // DETALHES
  details: {
    marginTop: 10,
    backgroundColor: '#161B22',
    padding: 12,
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 6,
  },

  detailsTitle: {
    fontWeight: 'bold',
    color: '#58A6FF',
    marginBottom: 6,
  },

  detailsText: {
    color: '#C9D1D9',
    fontSize: 13,
  },

  dateInput: {
  backgroundColor: '#0D1117',
  borderWidth: 1,
  borderColor: '#30363D',
  padding: 10,
  marginTop: 5,
  borderRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

dateText: {
  color: '#FFFFFF',
},

calendarIcon: {
  color: '#58A6FF',
},
});