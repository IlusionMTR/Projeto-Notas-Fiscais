import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import styles from './LoginStyles';

export default function Login({ usuario, setUsuario, senha, setSenha, onLogin, onIrParaCadastro }) {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      {/* BOX CENTRAL */}
      <View style={styles.card}>

        <Text style={styles.titulo}>NexusNF</Text>

        <Text style={styles.titulo}>Entrar</Text>

        <TextInput
          placeholder="Usuário ou E-mail"
          placeholderTextColor="#8B949E"
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#8B949E"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity 
          style={styles.botao} 
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.texto}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onIrParaCadastro} 
          style={styles.linkContainer}
        >
          <Text style={styles.textoLink}>
            Não tem uma conta? <Text style={styles.linkDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}