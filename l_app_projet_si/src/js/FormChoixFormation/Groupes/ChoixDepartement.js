import React from 'react'
import Form from 'react-bootstrap/Form'

class ChoixDepartement extends React.Component {
	state= {
		error: null,
		isLoaded: false,
		departements: []	
	};

	componentDidMount() {
		fetch("http://localhost:3000/departements/"+this.props.ufr)
		.then(res => res.json())
		.then(
			(result) => {
				result.unshift({idDept: "0", nomDept: ""})
				this.setState({
					isLoaded: true,
					departements: result.map(dept => {return {idDept: String(dept.idDept), nomDept: dept.nomDept}})
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
		if(this.props.ufr!==prevProps.ufr) {

			fetch("http://localhost:3000/departements/"+this.props.ufr)
			.then(res => res.json())
			.then(
				(result) => {
					result.unshift({idDept: "0", nomDept: ""})
					this.setState({
						isLoaded: true,
						departements: result.map(dept => {return {idDept: String(dept.idDept), nomDept: dept.nomDept}})
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
		const {error, isLoaded, departements} =this.state;
		if(error) {
			return <div>Erreur : {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Chargement…</div>;
		} else {
			return (
				<Form.Group>
					<Form.Label>Département</Form.Label>
					<Form.Select onChange={this.handleChange.bind(this)} isInvalid={this.props.invalide} value={departements.filter(departement=>departement.idDept===this.props.valeur)[0].nomDept}>
						{departements.map(
							departement => <option key={departement.idDept} id={departement.idDept}>{departement.nomDept}</option>
							)
						}
					</Form.Select>
				</Form.Group>
			);
		}
	}
}

export default ChoixDepartement;