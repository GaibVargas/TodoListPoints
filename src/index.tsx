import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");

const Home = () => {
  const [notes, setNotes] = useState<String[]>([]);
  const [input, setInput] = useState('');
  const [points, setPoints] = useState(0);

  async function handleAddTodo() {
    if(notes.includes(input)) return;

    setNotes(notes => [...notes, input]);
    setPoints(points => points + 1);

    const currentValue = await AsyncStorage.getItem("@TodoListPoints:points")
    await AsyncStorage.setItem("@TodoListPoints:points", `${Number(currentValue) + 1}`);

    db.transaction(tx => {
      tx.executeSql(
        "insert into notes (value) values (?);",
        [input]
      );
    });

    setInput('');
  }

  async function handleDeleteTodo(note: String) {
    setNotes(notes => notes.filter(item => item !== note));
    setPoints(points => points + 2);

    const currentValue = await AsyncStorage.getItem("@TodoListPoints:points")
    await AsyncStorage.setItem("@TodoListPoints:points", `${Number(currentValue) + 2}`);

    db.transaction(tx => {
      tx.executeSql(
        "delete from notes where value = ?;",
        [note]
      );
    });
  }

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists notes (id integer primary key not null, value text);"
      );

      tx.executeSql(
        "select value from notes;",
        [],
        (_, { rows: { _array } }) => {
          const dbNotes = _array.map(item => item.value);
          setNotes([...dbNotes]);
        }
      );
    });
  }, []);

  useEffect(() => {
    async function loadPoints() {
      const value = await AsyncStorage.getItem("@TodoListPoints:points");
      if (value === null) {
        await AsyncStorage.setItem("@TodoListPoints:points", "0");
        const initialValue = await AsyncStorage.getItem("@TodoListPoints:points");
        setPoints(Number(initialValue));
        return;
      }
      setPoints(Number(value));
    }

    loadPoints();
  }, []);

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

      <View style={styles.detailContainer}>
        <Text style={styles.title}>Todo List</Text>
        <Text style={styles.points}>Pontos: {points}</Text>
      </View>

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
    fontSize: 16,
  },

  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },

  points: {
    fontSize: 14,
  },
});

export default Home;
