import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0D1117' 
  },
  
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
  
  main: { 
    flex: 1, 
    flexDirection: 'row' 
  },
  
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
  
  details: { 
    marginTop: 10, 
    backgroundColor: '#161B22', 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#30363D', 
    borderRadius: 6 
  },
  detailsTitle: { 
    fontWeight: 'bold', 
    color: '#58A6FF', 
    marginBottom: 10,
    fontSize: 15
  },
  detailsText: { 
    color: '#C9D1D9', 
    fontSize: 13,
    marginBottom: 4
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
    alignItems: 'center' 
  },
  dateText: { 
    color: '#FFFFFF',
    fontSize: 13
  },
  calendarIcon: { 
    color: '#58A6FF',
    fontSize: 12
  },

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