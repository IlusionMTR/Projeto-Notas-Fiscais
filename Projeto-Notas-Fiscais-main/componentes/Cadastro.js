import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import styles from './CadastroStyles';

export default function Cadastro({ 
  nome, setNome, 
  email, setEmail, 
  senha, setSenha, 
  confirmarSenha, setConfirmarSenha, 
  onCadastro,
  onVoltar // Adicione isso aqui
}) {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f171e" />

      <View style={styles.box}>
        <Text style={styles.titulo}>Criar Conta</Text>

        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#666666"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          keyboardAppearance="dark"
        />

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#666666"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          keyboardAppearance="dark"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#666666"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          keyboardAppearance="dark"
        />

        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#666666"
          secureTextEntry
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          keyboardAppearance="dark"
        />

        <TouchableOpacity 
          style={styles.botao} 
          onPress={onCadastro}
          activeOpacity={0.8}
        >
          <Text style={styles.texto}>Cadastrar</Text>
        </TouchableOpacity>

        {/* BOTÃO PARA VOLTAR AO LOGIN */}
        <TouchableOpacity 
          onPress={onVoltar} 
          style={{ marginTop: 20, alignItems: 'center' }}
        >
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Já tenho conta. Entrar</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}