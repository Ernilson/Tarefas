import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tasklist from './src/componente/TaskList';
import * as Animatable from 'react-native-animatable';
import { useCallback } from 'react';

export default function App() {

  const AnimatedBth = Animatable.createAnimatableComponent(TouchableOpacity);

  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState();

  //Busca todas as tarefas ao iniciar o app
  useEffect(() => {
    async function loadTask(){
       const taskStorage = await AsyncStorage.getItem('@task');
       if(taskStorage){
          setTask(JSON.parse(taskStorage));
       }
    }
    
    loadTask();

   }, []);

   // salva tarefas alteradas
   useEffect(()=>{
     async function saveTask(){
       await AsyncStorage.setItem('@task', JSON.stringify(task));
     }

     saveTask();

   }, [task]);

  function handleAdd() {
    if (input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false),
      setInput('');
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);

  })

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.container}>
        <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <FlatList
        showsHorizontalScroLLIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => <Tasklist data={item} handleDelete={handleDelete} />}
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons style={{ marginLeft: 5, marginRight: 5 }} name="md-arrow-back" size={40} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View >
          <Animatable.View style={styles.modelBody} animation="fadeInUp" useNativeDriver>
            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder=" O que tenho que fazer hoje!?"
              style={styles.input}
              value={input}
              onChangeText={(texto) => setInput(texto)}
            />
            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatedBth
        style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#171d31" />
      </AnimatedBth>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90ee90'
  },
  title: {
    marginTop: 40,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    color: '#171d31'
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    }
  },
  modal: {
    flex: 1,
    backgroundColor: '#0094FF',
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF'
  },
  modelBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 17,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
  },
  handleAdd: {
    backgroundColor: '#FFF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText: {
    fontSize: 20,
  }
});
