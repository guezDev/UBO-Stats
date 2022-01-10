import React from 'react'
import Form from 'react-bootstrap/Form'

class ChoixParcours extends React.Component {
	state= {
		error: null,
		isLoaded: false,
		parcours: []
	};

	componentDidMount() {
		fetch("http://localhost:3000/parcours_formation/"+this.props.type+"/"+this.props.niveau)
		.then(res => res.json())
		.then(
			(result) => {
				result.unshift({nomParcours: ""})
				this.setState({
					isLoaded: true,
					parcours: result
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
		if(this.props.niveau!==prevProps.niveau) {
			fetch("http://localhost:3000/parcours_formation/"+(this.props.type ==="" ? "0":this.props.type)+"/"+this.props.niveau)
			.then(res => res.json())
			.then(
				(result) => {
					result.unshift({nomParcours: ""})
					this.setState({
						isLoaded: true,
						parcours: result
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
	}

	handleChange(e) {
		this.props.onChange(e)
	}

	render() {
		const {error, isLoaded, parcours} =this.state;
		if(error) {
			return <div>Erreur : {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Chargement…</div>;
		} else {
			if(parcours.length===1) return <span></span>;
			return (
				<Form.Group>
					<Form.Label>Parcours</Form.Label>
					<Form.Select onChange={this.handleChange.bind(this)} isInvalid={this.props.invalide} value={parcours.filter(p=>p.nomParcours===this.props.valeur)[0].nomParcours}>
						{parcours.map(
							p => <option key={(p.nomParcours ==="" ? "0":p.nomParcours)} id={(p.nomParcours ==="" ? "0":p.nomParcours)}>{p.nomParcours}</option>
							)
						}
					</Form.Select>
				</Form.Group>
			);
		}
	}
}

export default ChoixParcours;