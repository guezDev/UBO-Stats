import React from 'react';
import ChoixUFR from './Groupes/ChoixUFR';
import ChoixDepartement from './Groupes/ChoixDepartement';
import ChoixType from './Groupes/ChoixType';
import ChoixNiveau from './Groupes/ChoixNiveau';
import ChoixParcours from './Groupes/ChoixParcours';
import {Form, Modal, Button} from 'react-bootstrap'


class FormChoixFormation extends React.Component {
	state={
		ufr:"0",
		ufr_invalide:false,

		departement:"0",
		departement_invalide:false,

		type:"0",
		type_invalide:false,

		niveau: "0",
		niveau_invalide: false,

		parcours: "0",
		parcours_invalide:false,

		click_on_submit: false,
		data_sent: [],
		already_sent_message:false
	}

	componentDidUpdate(prevProps) {
		if(prevProps.aDeletion!==this.props.aDeletion) {
			let data
			if(this.props.data_supp==="all") {
				data=[]
			} else {
				let chaine
				data=this.state.data_sent
				for(let i=0; i<data.length;i++) {
					chaine=data[i].type+" "+data[i].niveau+" "+data[i].parcours
					if(chaine===this.props.data_supp) {
						data.splice(i,1)
						break
					}
				}
			}

			this.setState({data_sent: data})
		}
	}

	handleChangeUFR(e) {
		let ufrChoisie=Array.from(e.target.children).filter(child => child.selected===true);
		this.setState({
			ufr: ufrChoisie[0].id, 
			ufr_invalide: (ufrChoisie[0].id==="0" && this.state.click_on_submit ? true:false),
			departement: "0", 
			departement_invalide: this.state.click_on_submit, 
			type: "0", 
			type_invalide: this.state.click_on_submit, 
			niveau: "0", 
			parcours: "0",
			parcours_invalide: this.state.click_on_submit,
			already_sent_message:false
		})
	}

	handleChangeDepartement(e) {
		let departementChoisie=Array.from(e.target.children).filter(child => child.selected===true);
		this.setState({
			departement: departementChoisie[0].id, 
			departement_invalide: (departementChoisie[0].id==="0" && this.state.click_on_submit ? true:false), 
			type: "0", 
			type_invalide:this.state.click_on_submit, 
			niveau: "0", 
			parcours: "0",
			parcours_invalide: this.state.click_on_submit,
			already_sent_message:false
		})
	}

	handleChangeType(e) {
		let typeChoisie=Array.from(e.target.children).filter(child => child.selected===true);
		this.setState({
			type: typeChoisie[0].id, 
			type_invalide: (typeChoisie[0].id==="0" && this.state.click_on_submit ? true:false), 
			niveau: "0", 
			niveau_invalide: this.state.click_on_submit, 
			parcours: "0",
			parcours_invalide: this.state.click_on_submit,
			already_sent_message:false
		})
	}

	handleChangeNiveau(e) {
		let niveauChoisie=e.target.attributes.val.value;
		this.setState({
			niveau: niveauChoisie,
			parcours: "0", 
			parcours_invalide: this.state.click_on_submit,
			already_sent_message:false})
	}

	handleChangeParcours(e) {
		let parcoursChoisie=Array.from(e.target.children).filter(child => child.selected===true);
		this.setState({
			parcours: parcoursChoisie[0].id,
			parcours_invalide: parcoursChoisie[0].id==="0" && this.state.click_on_submit ? true:false,
			already_sent_message:false})
	}

	handleSubmit(e) {
		this.setState({click_on_submit: true})
		if(this.state.ufr==="0") {
			this.setState({ufr_invalide: true})
		}
		
		if(this.state.departement==="0") {
			this.setState({departement_invalide: true})
		}
		
		if(this.state.type==="0") {
			this.setState({type_invalide: true})
		}
		
		if(this.state.parcours==="0") {
			this.setState({parcours_invalide: true})
		}

		if(this.state.already_sent_message===true) {
			this.setState({already_sent_message:false})
		}

		if(this.state.ufr!=="0" && this.state.departement!=="0" && this.state.type!=="0" && this.state.niveau!=="0" && this.state.parcours!=="0") {
			let i=3;
			while(e.target.elements[i].checked===false) {
				i++
			}

			let new_data= {
				type: e.target.elements[2].value,
				niveau: e.target.elements[i].attributes["val"].value,
				parcours: e.target.elements[e.target.elements.length-2].value
			}

			let already_sent=false
			let data_sent=this.state.data_sent
			for(let j=0; j<data_sent.length;j++) {
				if(data_sent[j].type===new_data.type &&
					data_sent[j].niveau===new_data.niveau && 
					 data_sent[j].parcours===new_data.parcours) {
					already_sent=true;
					break;
				}
			}

			if(already_sent===false) {
				data_sent.push(new_data)
				this.setState({data_sent: data_sent, already_sent_message:false})
				
				this.props.onSubmit(e)
			} else {
				this.setState({already_sent_message:true})
			}
		}

		e.preventDefault();
	}

	render() {
		return(
			<Modal show={this.props.ouvrir && this.props.charge} animation={true} onHide={this.props.onClickHide}>

				<Modal.Header closeButton>
					<Modal.Title>Selectionner formation</Modal.Title>
				</Modal.Header>

				<Form onSubmit={this.handleSubmit.bind(this)}>
					<Modal.Body>
							<ChoixUFR onChange={this.handleChangeUFR.bind(this)} invalide={this.state.ufr_invalide} valeur={this.state.ufr}/>
							<ChoixDepartement ufr={this.state.ufr} onChange={this.handleChangeDepartement.bind(this)} invalide={this.state.departement_invalide} valeur={this.state.departement}/>
							<ChoixType departement={this.state.departement} onChange={this.handleChangeType.bind(this)} invalide={this.state.type_invalide} valeur={this.state.type==="0" ? "":this.state.type}/>
							<ChoixNiveau type={this.state.type} onChange={this.handleChangeNiveau.bind(this)} niveau={this.state.niveau} click_submit={this.state.click_on_submit}/>
							<ChoixParcours type={this.state.type} niveau={this.state.niveau} onChange={this.handleChangeParcours.bind(this)} invalide={this.state.parcours_invalide} valeur={this.state.parcours==="0" ? "":this.state.parcours}/>
					</Modal.Body>

					<Modal.Footer>
						<span style={{color:'red', textAlign: 'center', marginRight: '4em'}}>{this.state.already_sent_message===true ? "Vous avez déjà ajouté cette formation":""}</span>
						<Button type="submit">Valider</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		)
	}
}

export default FormChoixFormation;