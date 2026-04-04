import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './DashboardStyles';

export default function Dashboard({ pedidos, emitirNota }) {
  const renderPedido = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.cliente}>{item.cliente}</Text>
        <Text style={styles.detalhes}>
          ID: {item.id} | {item.valor}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.botao,
          item.status === 'Emitida' ? styles.sucesso : styles.pendente,
        ]}
        onPress={() => item.status === 'Pendente' && emitirNota(item.id)}
      >
        <Text style={styles.texto}>
          {item.status === 'Pendente' ? 'Gerar Nota' : 'Concluído'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Notas Mercado Livre</Text>
        <Text style={styles.subtitulo}>Gerenciamento de Pedidos</Text>
      </View>

      {/* LISTA */}
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={renderPedido}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}