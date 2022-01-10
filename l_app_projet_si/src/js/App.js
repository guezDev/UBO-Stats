import React from 'react';
import Header from './Header';
import Main from './Main';
import FormChoixFormation from './FormChoixFormation/FormChoixFormation';
import {Modal} from 'react-bootstrap'
import '../css/App.css';

class App extends React.Component {
	state= {
		ouvrir: true,
		annees: [],
		formData: [],
		datasets_graphique: [],
		datasets_graphique_line: [],
		couleurs_utilisees: [],
		data_supp: "",
		aDeletion: 0,

		isLoaded: true
	}

	backgroundColor= [
		"rgba(255, 134,159,0.4)",
		"rgba(98,  182, 239,0.4)",
		"rgba(255, 218, 128,0.4)",
		"rgba(113, 205, 205,0.4)",
		"rgba(170, 128, 252,0.4)",
		"rgba(255, 177, 101,0.4)"
	  ]
	borderWidth= 2
	borderColor= [
		"rgba(255, 134, 159, 1)",
		"rgba(98,  182, 239, 1)",
		"rgba(255, 218, 128, 1)",
		"rgba(113, 205, 205, 1)",
		"rgba(170, 128, 252, 1)",
		"rgba(255, 177, 101, 1)"
	  ]

	componentDidMount() {
		fetch("http://localhost:3000/annees")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						annees: result.map(annee=> Number(annee.anneeFormation)).sort() 
					});
				},
				(error) => {
					this.setState({
						error
					});
				}
			)
	}

	handleClickHide() {
		this.setState({ouvrir: false})
	}


	getData(e) {
		let a=3;
		while(e.target.elements[a].checked===false) {
			a++
		}
		let _type=e.target.elements[2].value,
		_niveau=e.target.elements[a].attributes["val"].value,
		_parcours= e.target.elements[e.target.elements.length-2].value;

		this.setState({isLoaded: false})

		/**recup id de la formation et enregistre dans formData*/
	
		fetch("http://localhost:3000/idFormation/"+_type+"/"+Number(_niveau)+"/"+_parcours)
		.then(res => res.json())
		.then(
			(result) => {

				let new_data= {
					idFormation: result[0].idFormation,
					type: _type,
					niveau: _niveau,
					parcours: _parcours
				}
		
				let data=[]
				for(let i=0;i<this.state.formData.length;i++) {
					data[i]=this.state.formData[i]
				}

				data.unshift(new_data)
		
				this.setState({
					formData: data,
				})
				
			},
			(error) => {
				this.setState({
					error,
					isLoaded: true
				});
			}
		)

		this.setState({isLoaded: false})

		setTimeout(()=>{
			let g_new_data={}, g_new_data_line={}
			g_new_data["label"]=this.state.formData[0].type+" "+this.state.formData[0].niveau+" "+this.state.formData[0].parcours
			g_new_data["data"]=[]
			g_new_data["annee_effectif"]={}
			g_new_data["backgroundColor"]=[]
			g_new_data["borderColor"]=[]
			g_new_data["borderWidth"]= 2

			g_new_data_line["label"]=this.state.formData[0].type+" "+this.state.formData[0].niveau+" "+this.state.formData[0].parcours
			g_new_data_line["fill"]=false
			g_new_data_line["data"]=[]
			g_new_data_line["annee_effectif"]={}
			g_new_data_line["lineTension"]= 0.3
			g_new_data_line["borderCapStyle"]= "butt"
			g_new_data_line["borderDash"]= []
			g_new_data_line["borderDashOffset"]= 0.0
			g_new_data_line["borderJoinStyle"]= "miter"
			g_new_data_line["pointBorderWidth"]= 10
			g_new_data_line["pointHoverRadius"]= 5
			g_new_data_line["pointHoverBorderWidth"]= 2
			g_new_data_line["pointRadius"]=1
			g_new_data_line["pointHitRadius"]= 10

			let ind_couleur= Array.from(Array(this.state.formData.length).keys()).filter(val => this.state.couleurs_utilisees.includes(val)===false)[0]
			g_new_data_line["backgroundColor"]= this.backgroundColor[ind_couleur]
			g_new_data_line["borderColor"]= this.borderColor[ind_couleur]
			g_new_data_line["pointBorderColor"]= this.borderColor[ind_couleur]
			g_new_data_line["pointBackgroundColor"]= this.backgroundColor[ind_couleur]

			for(let i=0;i<this.state.annees.length;i++) {
				fetch("http://localhost:3000/effectifs/"+Number(this.state.annees[i])+"/"+Number(this.state.formData[0].idFormation))
				.then(res => res.json())
				.then(
					(result) => {
						//console.log(result);
						g_new_data["data"][i]=result[0].effectif
						g_new_data["annee_effectif"][this.state.annees[i]]=result[0].effectif
						g_new_data["backgroundColor"][i]=this.backgroundColor[ind_couleur]
						g_new_data["borderColor"][i]=this.borderColor[ind_couleur]
						
						g_new_data_line["data"][i]=result[0].effectif
						g_new_data_line["annee_effectif"][this.state.annees[i]]=result[0].effectif
					},
					(error) => {
						this.setState({
							error,
							isLoaded: true
						});
					}
				)	
			}

			let d_graphique=this.state.datasets_graphique.map(data => data), couleurs=this.state.couleurs_utilisees.map(val => val)
			let d_graphique_line=this.state.datasets_graphique_line.map(data => data)

			d_graphique.unshift(g_new_data)
			d_graphique_line.unshift(g_new_data_line)

			couleurs.push(ind_couleur)
			this.setState({datasets_graphique: d_graphique,
				datasets_graphique_line:  d_graphique_line,
				isLoaded:true, 
				couleurs_utilisees: couleurs
			})

		},500)

		//setTimeout(()=>console.log(this.state.datasets_graphique),800)
	}

	handleDelete(e) {
		let data=this.state.formData.filter(data => data), chaine, 
		d_graphique=this.state.datasets_graphique.map(data => data),
		d_graphique_line=this.state.datasets_graphique_line.map(data => data),
		couleurs=this.state.couleurs_utilisees.map(val => val)
		
		for(let i=0; i<data.length;i++) { //chaque formation

			chaine=data[i].type+" "+data[i].niveau+" "+data[i].parcours
			if(chaine===e.target.attributes['id'].value) {
				d_graphique.splice(i,1)
				d_graphique_line.splice(i,1)

				data.splice(i,1)

				couleurs.splice(i,1)
				break
			}
		}
		this.setState({formData: data, 
			datasets_graphique: d_graphique, 
			datasets_graphique_line: d_graphique_line, 
			data_supp: chaine, 
			aDeletion: this.state.aDeletion===0 ? 1:0,
			couleurs_utilisees: couleurs
		})
	}

	handleDeleteAll() {
		this.setState({formData: [], datasets_graphique: [], datasets_graphique_line: [], data_supp: "all", aDeletion: this.state.aDeletion===0 ? 1:0})
	}


	render() {
		
			return (
				<div>
					<Header/>
					<Main onClickAjouter={()=> this.setState({ouvrir: true})} annees={this.state.annees} data={this.state.formData} data_graphique={this.state.datasets_graphique} data_graphique_line={this.state.datasets_graphique_line} onDelete={this.handleDelete.bind(this)} onDeleteAll={this.handleDeleteAll.bind(this)}/>
					<Modal show={!this.state.isLoaded} centered>
						<Modal.Body>
							<div id="bloc-loader">
								<div className="spinner-border" role="status">
									<span className="sr-only"></span>
								</div>
								<span>Chargement</span>
							</div>
						</Modal.Body>
					</Modal>
					<FormChoixFormation charge={this.state.isLoaded} ouvrir={this.state.ouvrir} onClickHide={this.handleClickHide.bind(this)} onSubmit={this.getData.bind(this)} data_supp={this.state.data_supp} aDeletion={this.state.aDeletion}/>
					<footer>
						<span><a target="_blank" rel="noreferrer" href="https://www.univ-brest.fr/dsiun/outils/Mentions_legales">Infos Légales</a></span>
					</footer>
				</div>
			);
	}

}

export default App;
