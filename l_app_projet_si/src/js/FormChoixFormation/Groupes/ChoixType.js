import React from 'react'
import Form from 'react-bootstrap/Form'

class ChoixType extends React.Component {
	state= {
		error: null,
		isLoaded: false,
		types: []	
	};

	componentDidMount() {
		fetch("http://localhost:3000/types_formation/"+this.props.departement)
		.then(res => res.json())
		.then(
			(result) => {
				result.unshift({type: ""})
				this.setState({
					isLoaded: true,
					types: result
				});
			},
			(error) => {
				this.setState({
					isLoaded: true,
					error
				});
			}
		)
	}

	componentDidUpdate(prevProps) {
		if(this.props.departement!==prevProps.departement){

			fetch("http://localhost:3000/types_formation/"+this.props.departement)
			.then(res => res.json())
			.then(
				(result) => {
					result.unshift({type: ""})
					this.setState({
						isLoaded: true,
						types: result
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
		}
		//}
	}

	handleChange(e) {
		this.props.onChange(e)
	}

	render() {
		const {error, isLoaded, types} =this.state;
		if(error) {
			return <div>Erreur : {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Chargement…</div>;
		} else {
			return (
				<Form.Group>
					<Form.Label>Type</Form.Label>
					<Form.Select onChange={this.handleChange.bind(this)} isInvalid={this.props.invalide} value={types.filter(type=>type.type===this.props.valeur)[0].type}>
						{types.map(
							type => <option key={(type.type ==="" ? "0":type.type)} id={(type.type==="" ? "0":type.type)}>{type.type}</option>
							)
						}
					</Form.Select>
				</Form.Group>
			);
		}
	}
}

export default ChoixType;