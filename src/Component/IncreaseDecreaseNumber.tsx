import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTailwind } from 'tailwind-rn/dist'
import AntDesign from 'react-native-vector-icons/AntDesign';
interface increDecre {
    currentNum: number,
    setCurrentNum: React.Dispatch<React.SetStateAction<number>>
}
const IncreaseDecreaseNumber = ({currentNum, setCurrentNum}: increDecre) => {
    const tw = useTailwind()
    const minusCapacity = () => {
        if(currentNum > 1) {
            setCurrentNum(currentNum - 1)
        }
    }
  return (
    <View style={tw('flex-row items-center justify-center')}>
        <TouchableOpacity onPress={minusCapacity} style={tw(' w-8 h-8 items-center justify-center rounded-full bg-white mr-2')}>
            <AntDesign name="minuscircleo" size={28} color="gray"></AntDesign> 
        </TouchableOpacity>
        <Text style={tw('text-2xl text-black mr-2')}>{currentNum}</Text>
        <TouchableOpacity onPress={() => setCurrentNum(currentNum + 1)} style={tw(' w-8 h-8 items-center justify-center rounded-full bg-white')}>
            <AntDesign name="pluscircleo" size={28} color="gray"></AntDesign> 
        </TouchableOpacity>
    </View>
  )
}

export default IncreaseDecreaseNumber

const styles = StyleSheet.create({})