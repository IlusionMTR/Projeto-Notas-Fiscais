import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117', // fundo dark moderno
  },

  header: {
    backgroundColor: '#161B22',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderColor: '#30363D',
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  subtitulo: {
    color: '#8B949E',
    fontSize: 13,
    marginTop: 4,
  },

  lista: {
    padding: 15,
  },

  card: {
    backgroundColor: '#161B22',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#30363D',

    // sombra leve
    elevation: 4,
  },

  cliente: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF',
  },

  detalhes: {
    fontSize: 12,
    color: '#8B949E',
    marginTop: 4,
  },

  botao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  pendente: {
    backgroundColor: '#F85149', // vermelho moderno
  },

  sucesso: {
    backgroundColor: '#238636', // verde GitHub style
  },

  texto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});