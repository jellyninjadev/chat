import React, {useLayoutEffect, useState} from 'react'
import {Button, FlatList, Text, View} from 'react-native'
import {User, useStore} from './store'
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParamList} from "./Navigator";
import styles, {NavigationStyle} from "./styles";
import {ListViewItem} from "./components/ListViewItem";

export default ({navigation}: { navigation: NativeStackNavigationProp<StackParamList, 'CreateChannel'> }) => {
  const {state, dispatch} = useStore()
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const toggleContact = (item: User) => {
    console.log('toggle contact', item, selectedContacts)
    const newSelectedContacts = new Set(selectedContacts)
    if (newSelectedContacts.has(item._id)) {
      newSelectedContacts.delete(item._id)
    } else {
      newSelectedContacts.add(item._id)
    }
    setSelectedContacts([...newSelectedContacts])
  }

  const promptText = !selectedContacts.length ?
    'Who would you like to add?' :
    selectedContacts.map(_id => state.contacts.find(c => c._id === _id)).map(c => c.name).join(', ')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <View style={NavigationStyle.headerRight}>
          <Button
            disabled={!selectedContacts.length}
            onPress={() => navigation.navigate('CreateGroupDetails', {
              members: selectedContacts.map(_id => state.contacts.find(c => c._id === _id))
            })}
            title="Next" />
        </View>
    })
  }, [navigation, selectedContacts])

  return <View>
    <View style={styles.textInput}>
      <Text>{promptText}</Text>
    </View>
    <FlatList
      extraData={selectedContacts}
      data={state.contacts}
      renderItem={({item}) =>
      <ListViewItem
        item={item}
        onPress={() => toggleContact(item)}
        selectedItems={selectedContacts}
      />}
      keyExtractor={item => item._id}
    />
  </View>
}
