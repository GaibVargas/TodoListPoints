import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const Home = () => {
  const [notes, setNotes] = useState<String[]>([]);
  const [input, setInput] = useState('');

  function handleAddTodo() {
    if(notes.includes(input)) return;

    setNotes(notes => [...notes, input]);
    setInput('');
  }

  function handleDeleteTodo(note: String) {
    setNotes(notes => notes.filter(item => item !== note));
  }

  return(
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <RectButton style={styles.add} onPress={handleAddTodo}>
          <Icon name="add" size={24} />
        </RectButton>
      </View>

      <Text style={styles.title}>Todo List</Text>

      <ScrollView style={styles.listItem}>
        {notes && notes.map(note => (
          <View key={String(note)} style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>{note}</Text>
            </View>
            <View style={styles.delete}>
              <RectButton
                style={styles.button}
                onPress={() => handleDeleteTodo(note)}
              >
                <Icon name="delete" size={24} />
              </RectButton>
            </View>
          </View>
        ))}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8'
  },

  inputContainer: {
    flexDirection: 'row',
  },

  input: {
    flex: 1,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 4,
    height: 45,
    marginRight: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },

  add: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    borderRadius: 4,
  },

  listItem: {
    marginVertical: 10,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 40,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 4,
    marginVertical: 5,
  },

  delete: {
    backgroundColor: 'red',
    height: '100%',
    width: 50,
    borderWidth: 1,
    borderColor: 'red',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  button: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
    paddingLeft: 20,
    height: '100%',
    justifyContent: 'center',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#fff',
  },

  itemText: {
  },
});

export default Home;
