import React from 'react';
import Form from 'react-bootstrap/Form';

class ChoixNiveau extends React.Component {
	state= {
		error: null,
		isLoaded: false,
		niveaux: [],
	};

	componentDidMount() {
		fetch("http://localhost:3000/niveaux_formation/"+this.props.type)
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isLoaded: true,
					niveaux: result.map(level=> {return {niveau: String(level.niveau)}})
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
		if(this.props.type!==prevProps.type) {
			fetch("http://localhost:3000/niveaux_formation/"+this.props.type)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						niveaux:result.map(level=> {return {niveau: String(level.niveau)}})
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)

			//window.location.reload();
		}
	}

	handleChange(e) {
		this.props.onChange(e)
	}

	render() {
		const {error, isLoaded} =this.state;
		let niveaux=this.state.niveaux.map(niveau => niveau.niveau);
		niveaux.sort();
		if(error) {
			return <div>Erreur : {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Chargement…</div>;
		} else {
			if(niveaux.length===0) return <span></span>;
			return (
				<Form.Group>
					<Form.Label>Niveau</Form.Label><br/>
					{niveaux.map(
						niveau => <Form.Check inline type="radio" checked={this.props.niveau===niveau} key={niveau} label={niveau} val={niveau} onChange={this.handleChange.bind(this)}/>
						)
					}

					<p style={{display: (this.props.niveau==="0" && this.props.click_submit ? 'block':'none'), color: 'red', fontSize:'12px'}}>Vous devez choisir un niveau</p>
				</Form.Group>
			);
		}
	}
}

export default ChoixNiveau;