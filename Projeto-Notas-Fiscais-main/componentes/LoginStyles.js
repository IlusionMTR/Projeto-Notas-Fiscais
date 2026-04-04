import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1117', // fundo dark real
    padding: 20,
  },

  // BOX (card)
  card: {
    width: 500,
    height: 400,
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',

    // sombra 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  titulo: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#0D1117',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#30363D',
  },

  botao: {
    backgroundColor: '#1F6FEB', //S azul moderno
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  texto: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  textoLink: {
    color: '#8B949E',
    fontSize: 14,
  },

  linkDestaque: {
    color: '#1F6FEB',
    fontWeight: 'bold',
  },
});