import React from 'react'
import Form from 'react-bootstrap/Form'


class ChoixUFR extends React.Component {
	state= {
		error: null,
		isLoaded: false,
		ufrs: []
	};

	componentDidMount() {
		fetch("http://localhost:3000/ufrs")
		.then(res => res.json())
		.then(
			(result) => {
				result.unshift({idUFR: "0", nomUFR_court: ""})
				this.setState({
					isLoaded: true,
					ufrs: result.map(ufr=> {return {idUFR: String(ufr.idUFR), nomUFR_court: ufr.nomUFR_court}})
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

	handleChange(e) {
		this.props.onChange(e);
	}

	render() {
		const {error, isLoaded, ufrs} =this.state;
		if(error) {
			return <div>Erreur : {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Chargement…</div>;
		} else {
			return (
				<Form.Group>
					<Form.Label>UFR</Form.Label>
					<Form.Select onChange={this.handleChange.bind(this)} isInvalid={this.props.invalide} value={ufrs.filter(ufr=>ufr.idUFR===this.props.valeur)[0].nomUFR_court}>
						{ufrs.map(
							ufr => <option key={ufr.idUFR} id={ufr.idUFR}>{ufr.nomUFR_court}</option>
							)
						}
					</Form.Select>
				</Form.Group>
			);
		}
	}
}

export default ChoixUFR;