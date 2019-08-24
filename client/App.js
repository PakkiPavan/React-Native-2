import React from 'react';
import { StyleSheet, Text, View,Button,TextInput } from 'react-native';
import axios from 'axios';

export default class App extends React.Component {
	constructor(props)
	{
		super(props);
		this.state={text:"Hello World",uname:"",pass:""};
  }
  componentDidMount()
  {
    /*fetch('http://192.168.0.103:3001/countUsers')
		.then(res=>res.json())
		.then(data=>{
      console.log("DATA FOUND")
      console.log(data);
		})
		.catch(err=>alert("Something went wrong"))*/
		// setInterval(() => {
		// 	alert("IDLE");
		// }, 5000);
  }
	changeText=()=>{
		this.setState({text:"Welcome To React Native"})
	}
	handleChange=(event)=>{
		console.log(event.target.name);
	}
	login=()=>{
		console.log("LOGGED IN");
		if(this.state.uname==""||this.state.pass=="")
		{
			alert("All fields are mandatory");
		}
		else
		{
			axios.post('http://192.168.0.103:3001/serverLogin',{uname:this.state.uname,password:this.state.pass})
				.then(res=>{
					console.log(res.data);
					if(res.data.length>0)
					{
						console.log("Login Success");
					}
					else
					{
						console.log("Invalid Credentials")
					}
				})
				.catch(err=>console.log(err))
		}
	}
	render(){
		return (
			<View style={styles.container}>
				<Text>LOGIN</Text>
				<Text>User ID</Text>
				<TextInput
					name="uname"
					style={styles.input}
					onChangeText={(uname)=>this.setState({uname})}
				/>
				<Text>Password</Text>
				<TextInput
					name="password"
					style={styles.input}
					secureTextEntry={true}
					onChangeText={(pass)=>this.setState({pass})}
				/>
				

				<Button onPress={this.login} title="Login"/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'green',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	input:{
		borderColor:"black",
		borderWidth:1,
		width:250,
		height:30,
		marginBottom:20
	}
});
