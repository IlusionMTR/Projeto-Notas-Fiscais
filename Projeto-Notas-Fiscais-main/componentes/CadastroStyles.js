import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1117', // Fundo azul escuro idêntico ao Login
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#161B22', // Fundo da caixa levemente mais claro
    padding: 30,
    borderRadius: 20,
    // Sombras para destaque
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'stretch',
  },
  titulo: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#FFFFFF', // Título branco
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0D1117', // Input escuro
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFFFFF', // Texto digitado branco
    borderWidth: 1,
    borderColor: '#30363D', // Borda discreta
  },
  botao: {
    backgroundColor: '#1F6FEB', // Azul vibrante do botão de Login
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  texto: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});