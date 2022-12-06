//import './App.css';
import React from 'react';
//import ReactDOM from 'react-dom';
//import jsondata from './sm_damage.json';


function getChargeDamage(beamCombo){
	var charge_damage = 60;
	if(beamCombo[1]==1 && beamCombo[2]==0 && beamCombo[3]==0 && beamCombo[4]==0){
		// ice only
		charge_damage = 90;
	}
	if(beamCombo[1]==1 && beamCombo[2]==1 && beamCombo[3]==0 && beamCombo[4]==0){
		// ice + spazer
		charge_damage = 180;
	}
	if(beamCombo[1]==1 && beamCombo[2]==0 && beamCombo[3]==1 && beamCombo[4]==0){
		// ice + wave
		charge_damage = 180;
	}
	if(beamCombo[1]==1 && beamCombo[2]==0 && beamCombo[3]==0 && beamCombo[4]==1){
		// ice + plasma
		charge_damage = 600;
	}
	if(beamCombo[1]==0 && beamCombo[2]==1 && beamCombo[3]==0 && beamCombo[4]==0){
		// spazer only
		charge_damage = 120;
	}
	if(beamCombo[1]==0 && beamCombo[2]==1 && beamCombo[3]==1 && beamCombo[4]==0){
		// spazer + wave
		charge_damage = 210;
	}
	if(beamCombo[1]==0 && beamCombo[2]==0 && beamCombo[3]==1 && beamCombo[4]==0){
		// wave only
		charge_damage = 150;
	}
	if(beamCombo[1]==0 && beamCombo[2]==0 && beamCombo[3]==1 && beamCombo[4]==1){
		// wave + plasma
		charge_damage = 750;
	}
	if(beamCombo[1]==0 && beamCombo[2]==0 && beamCombo[3]==0 && beamCombo[4]==1){
		// plasma only
		charge_damage = 450;
	}
	if(beamCombo[1]==1 && beamCombo[2]==1 && beamCombo[3]==1 && beamCombo[4]==0){
		// ice + spazer + wave
		charge_damage = 300;
	}
	if(beamCombo[1]==1 && beamCombo[2]==0 && beamCombo[3]==1 && beamCombo[4]==1){
		// ice + wave + plasma
		charge_damage = 900;
	}
	return charge_damage;
}

function minAmmoMB2(my_missiles, my_supers, beamCombo){
	var result = [0,0,0,0,0,0];
	var missile_damage = (my_missiles*100);
	var super_damage = (my_supers*300);
	var total_damage = missile_damage+super_damage;
	var mb2_remaining = 18000;
	var haveCharge = (beamCombo[0]==1 ? true : false );
	
	if((18000-super_damage)<=0){
		result[1] = 60;
	} else {
		mb2_remaining -= super_damage;
		var needed_missiles = mb2_remaining/100;
		result[1] = my_supers;

		if(my_missiles>=needed_missiles){
			result[0] = needed_missiles;
		} else {
			result[0] = my_missiles;
			if(haveCharge){
				mb2_remaining -= missile_damage;
				var needed_charge_shots = Math.ceil(mb2_remaining/(getChargeDamage(beamCombo)));
				result[4] = needed_charge_shots;
			} else {
				result = [0,0,0,0,0,0];
			}
		}
	}
	return result
}

function minAmmoMB(my_missiles, my_supers, beamCombo){
	let minAmmoMB1Results = minAmmoMB1(my_missiles, my_supers);
	let haveCharge = (beamCombo[0]==1 ? true : false );
	
	if(minAmmoMB1Results[0]==0 && minAmmoMB1Results[1]==0 && minAmmoMB1Results[2]==0 && minAmmoMB1Results[3]==0){
		// not enough ammo for mb1
		return [0,0,0,0,0,0];
	}
	let minAmmoMB2Results = minAmmoMB2((my_missiles-minAmmoMB1Results[0]), (my_supers-minAmmoMB1Results[1]), haveCharge);
	if(minAmmoMB2Results[0]==0 && minAmmoMB2Results[1]==0 && minAmmoMB2Results[4]==0){
		return [0,0,0,0,0,0];
	}
	return [(minAmmoMB1[0]+minAmmoMB2[0]), (minAmmoMB1[1]+minAmmoMB2[1]), minAmmoMB1[2], minAmmoMB1[3], (haveCharge ? 1 : 0), 0];
}


function minAmmoMB1(my_missiles, my_supers){
	var result = [0,0,0,0,0,0];
	var loopFlag = false;
	var glass_m = 0;
	var glass_s = 0;

	if(my_missiles>=6){
		glass_m = 6;
		glass_s = 0;
	} else if(my_missiles<6 && my_missiles>0) {
		glass_m = my_missiles;
		glass_s = 6-my_missiles;
	} else if(my_missiles<=0 && my_supers>=6){
		glass_m = 0;
		glass_s = 6;
	}
	
	
	if(my_missiles>=36 || my_supers>=18){
		// you have min ammo, in any configuration.
		// display best MB strat config
		result[0] = 18;
		result[1] = 6;
		result[2] = glass_m;
		result[3] = glass_s;
	} else {
		if(my_supers<10){
			// (36 - 3*n)*M + n*SM, n element of {0,1,2,3,4,5,6,7,8,9}
			for(var i=0; i<10; i++){
				if(!loopFlag){
					var supers_needed = i;
					var missiles_needed = (36-(3*i));
					if(supers_needed<my_supers && missiles_needed<my_missiles){
						//
						// ammo recommendations
						
						result[0] = missiles_needed;
						result[1] = supers_needed;
						result[2] = glass_m;
						result[3] = glass_s;
						loopFlag = true;
					}	
				}
			} 
		} else {
			for(var i=0; i<9; i++){
				// (8 - n)*M + (10 + n)*SM, n element of {0,1,2,3,4,5,6,7,8}
				if(!loopFlag) {
					var supers_needed = (10+i);
					var missiles_needed = (8-i);
					if(supers_needed<my_supers && missiles_needed<my_missiles){
						// ammo recommendations 
						result[0] = missiles_needed;
						result[1] = supers_needed;
						result[2] = glass_m;
						result[3] = glass_s;
						loopFlag = true;
					}
				}
			}
		}
		return result;
	}
}

function App() {
	return (
		<div className="App">
			<header className="app_header">
				<img className="samus_img" src="" alt="Samus's S logo" />
				<h1>Super Metroid Damage Calculator</h1>
			</header>
			
			<DamageCalculator />
			
		</div>
	);
}

class DamageCalculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			beamCombo: [0,0,0,0,0],
			ammoCount: [0,0,0],
			sliderValues: [0,0],
			checkboxValues: [0,0]
		}
		this.handleToggleBeam = this.handleToggleBeam.bind(this);
		this.handleAmmoInput = this.handleAmmoInput.bind(this);
		this.handleSliderInput = this.handleSliderInput.bind(this);
		this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
		this.computeDamageRidley = this.computeDamageRidley.bind(this);
		this.computeDamageMB = this.computeDamageMB.bind(this);
	}
	
	//=======OLD FXs TO INTEGRATE===================================================================
	handleToggleBeam(beam) {

		let beamIndex;
		let newCombo;
		let singleBeamValue;
		
		if(beam == "charge" || beam == "charge selected"){
			beamIndex = 0;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [singleBeamValue, this.state.beamCombo[1], this.state.beamCombo[2], this.state.beamCombo[3], this.state.beamCombo[4]];
		} else if (beam == "ice" || beam == "ice selected"){
			beamIndex = 1;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [this.state.beamCombo[0], singleBeamValue, this.state.beamCombo[2], this.state.beamCombo[3], this.state.beamCombo[4]];
		} else if (beam == "spazer" || beam == "spazer selected"){
			beamIndex = 2;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			if(singleBeamValue == "1"){
				newCombo = [this.state.beamCombo[0], this.state.beamCombo[1], singleBeamValue, this.state.beamCombo[3], 0];
			} else {
				newCombo = [this.state.beamCombo[0], this.state.beamCombo[1], singleBeamValue, this.state.beamCombo[3], this.state.beamCombo[4]];
			}
		} else if (beam == "wave" || beam == "wave selected"){
			beamIndex = 3;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [this.state.beamCombo[0], this.state.beamCombo[1], this.state.beamCombo[2], singleBeamValue, this.state.beamCombo[4]];
		} else if (beam == "plasma" || beam == "plasma selected"){
			beamIndex = 4;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			if(singleBeamValue == "1"){
				newCombo = [this.state.beamCombo[0], this.state.beamCombo[1], 0, this.state.beamCombo[3], singleBeamValue];
			} else {
				newCombo = [this.state.beamCombo[0], this.state.beamCombo[1], this.state.beamCombo[2], this.state.beamCombo[3], singleBeamValue];
			}
		} else {
			console.log("error beam input");
			beamIndex = -1;
			singleBeamValue = (this.state.beamCombo[beamIndex]==1 ? 0 : 1);
			newCombo = [0,0,0,0,0];
		}
//		console.log(newCombo);
		this.setState({
		    beamCombo: newCombo
		});		
	};
	
	handleAmmoInput(sinlgeAmmoCount, ammoType){
		let ammoCount;
		
		if(ammoType == "missiles"){
			ammoCount = [sinlgeAmmoCount, this.state.ammoCount[1], this.state.ammoCount[2]];
		} else if (ammoType == "supers"){
			ammoCount = [this.state.ammoCount[0], sinlgeAmmoCount, this.state.ammoCount[2]];
		} else if (ammoType == "pbs"){
			ammoCount = [this.state.ammoCount[0], this.state.ammoCount[1], sinlgeAmmoCount];
		} else {
			ammoCount = [0,0,0];
		}
//		console.log(ammoCount);

		this.setState({
		    ammoCount: ammoCount
		});

	};
	
	handleSliderInput(singleSliderValue, weapon){
		let newValues;

		if (weapon == "pbs"){
			newValues = [singleSliderValue, this.state.sliderValues[1]];
		} else if(weapon == "xfactor"){
			newValues = [this.state.sliderValues[0], singleSliderValue];
		} else {
			newValues = [this.state.sliderValues[0], this.state.sliderValues[1]];
			console.log("slider input error");
		}
//		console.log(newValues);
		this.setState({
		    sliderValues: newValues	
		});
	};
	
	handleCheckboxInput(singleCheckbox, weapon){
		let newValues;
		if(weapon == "pbs"){
			 newValues = [singleCheckbox, this.state.checkboxValues[1]];
		} else if (weapon == "xfactor"){
			 newValues = [this.state.checkboxValues[0], singleCheckbox];
		} else {
			 newValues = [this.state.checkboxValues[0], this.state.checkboxValues[1]];
			console.log("checkbox input error");
		}
//		console.log(newValues);
		this.setState({
		    checkboxValues: newValues
		});
	};
	
	
	computeDamageRidley(){
		
	}
	
	computeDamageMB(){
		
	}
	
	//====================================================================================================
	
	render(){
		
		return (
			<div className="damage_calculator">
				<PlayerInput
					beamCombo={this.state.beamCombo} 
					ammoCount={this.state.ammoCount} 
					sliderValues={this.state.sliderValues} 
					checkboxValues={this.state.checkboxValues} 
		          	onToggleBeam={this.handleToggleBeam} 
					onAmmoInput={this.handleAmmoInput} 
					onSliderInput={this.handleSliderInput} 
					onCheckboxInput={this.handleCheckboxInput}
				 />
				<ResultsContainer
					beamCombo={this.state.beamCombo} 
					ammoCount={this.state.ammoCount} 
					sliderValues={this.state.sliderValues} 
					checkboxValues={this.state.checkboxValues} 
					computeDamageRidley={this.computeDamageRidley} 
					computeDamageMB={this.computeDamageMB}
				 />
			</div>
		);
	}

}
	
class PlayerInput extends React.Component {
	render(){

		return (
			<div className="player_input">
				<AmmoInput
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput} 
				 />
				<BeamInput
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
				<ExtraInput
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput}
				 />
			</div>
		);
	}
}

class ResultsContainer extends React.Component {
	render(){
//		console.log("RESULTSCONTAINER");
//		console.log(this.props);
		return (
			<div className="results_container">
				<ResultsRidley
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
					sliderValues={this.props.sliderValues}
				 />
				<ResultsMB
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
				 />
			</div>
		);
	}
}

class AmmoInput extends React.Component {
	render(){

		return (
			<div className="ammo_input">
				<AmmoInputItem 
					ammo="missiles" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput}
				 />
				<AmmoInputItem 
					ammo="supers" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput}
				 />
				<AmmoInputItem 
					ammo="pbs" 
					ammoCount={this.props.ammoCount} 
					onAmmoInput={this.props.onAmmoInput}
				 />
			</div>
		);
	}
}

class BeamInput extends React.Component {
	render(){

		return (
			<div className="beam_input">
				<BeamInputItem 
					beam="charge" 
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
				<BeamInputItem 
					beam="ice"
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
				<BeamInputItem 
					beam="spazer" 
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
				<BeamInputItem 
					beam="wave" 
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
				<BeamInputItem 
					beam="plasma" 
					beamCombo={this.props.beamCombo} 
	          		onToggleBeam={this.props.onToggleBeam}
				 />
			</div>
		);
	}
}

class ExtraInput extends React.Component {
	render(){

		return (
			<div className="extra_input">
				<ExtraInputItem 
					weapon="pbs" 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput}
				 />
				<ExtraInputItem 
					weapon="xfactor" 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues} 
					checkboxValues={this.props.checkboxValues} 
					onSliderInput={this.props.onSliderInput} 
					onCheckboxInput={this.props.onCheckboxInput}
				 />
			</div>
		);
	}
}

class AmmoInputItem extends React.Component {
	constructor(props) {
		super(props);
		this.handleAmmoInput = this.handleAmmoInput.bind(this);

	}

	handleAmmoInput(e){
		this.props.onAmmoInput(e.target.value, this.props.ammo);
//		console.log(e);
	}

	render(){

		return (
			<div className={this.props.ammo + " ammo_input_box"}>
            	<label>{this.props.ammo}</label>
            	<input type="number" defaultValue="0" min="0" max="999" onChange={this.handleAmmoInput.bind(this)} />
        	</div>
		);
	}
}

class BeamInputItem extends React.Component {
	constructor(props) {
		super(props);
		this.handleToggleBeam = this.handleToggleBeam.bind(this);
	}

	handleToggleBeam(e){
//		console.log(this.props.beam);
		this.props.onToggleBeam(this.props.beam);
	}

	render(){
//		console.log(this.newClassName);
		return (
			<li className={this.props.beam}>
				<button onClick={this.handleToggleBeam.bind(this)} type="button">{this.props.beam}</button>
			</li>
		);
	}
}

class ExtraInputItem extends React.Component {
	constructor(props) {
		super(props);
		this.handleCheckboxInput = this.handleCheckboxInput.bind(this);
		this.handleSliderInput = this.handleSliderInput.bind(this);
	}
	
	handleCheckboxInput(e){
		let singleValue = (e.target.checked ? 1 : 0)
		this.props.onCheckboxInput(singleValue, this.props.weapon);
	}
	
	handleSliderInput(e){
		this.props.onSliderInput(e.target.value, this.props.weapon);
	}

	render(){
		let maxPBs = this.props.ammoCount[2];
		
		return (
			<div className="extra_attack_choice">
				<form>
					<input type="checkbox" onChange={this.handleCheckboxInput.bind(this)} /> <span>Would you like to use {this.props.weapon}s against Ridley?</span>
					<div className="slider">
						<span>0</span> <input type="range" min="0" max={maxPBs} step="1" defaultValue="0" onChange={this.handleSliderInput.bind(this)} /> <span>MAX</span>
					</div>
				</form>
			</div>
		);
	}
}

class ResultsRidley extends React.Component {
	
	render(){
//		console.log("ResultsRidley");
//		console.log(this.props);
		// logic to decide live die results
		let willSurvive = false;
		let dead_alive;
		
		let charge_damage = 60;
		let only_charged;
		let total_charged = 0;
		
		let total_missiles = 0;
		let total_supers = 0;
		let total_pbs = 0;
		let total_xfactors = 0;
		
		let boss = 18000;
		
		if(this.props.beamCombo[0]==1){
			willSurvive = true;
			charge_damage = getChargeDamage(this.props.beamCombo);
			only_charged = Math.ceil((boss/charge_damage));
		}
		
		
		let missiles = this.props.ammoCount[0];
		let supers = this.props.ammoCount[1];
		let pbs = this.props.sliderValues[0];
		let xfactors = this.props.sliderValues[1];
		
		let missile_damage = 100*missiles;
		let super_damage = 600*supers;
		let pb_damage = 200*pbs;
		let xfactor_damage = 1200*xfactors;
		
		let boss_remaining = boss;

		// Calculate loadout box items

		let ammo_damage = 0;
		let ammo_totals;

		if(this.props.checkboxValues[0]==1){
			ammo_damage += pb_damage;
			boss_remaining -= pb_damage;
			total_pbs = pbs;
		}
		
		if(this.props.checkboxValues[1]==1){
			ammo_damage += xfactor_damage;
			boss_remaining -= xfactor_damage;
			total_xfactors = xfactors;
		}

		ammo_damage += super_damage;
		ammo_damage += missile_damage;
		
		if (boss_remaining<=super_damage){
//			console.log("supers > loop");
			total_supers = Math.ceil((boss_remaining/600));
			boss_remaining -= (total_supers*600);
		} else if (boss_remaining>super_damage){
//			console.log("supers < loop");
			total_supers = supers;
			boss_remaining -= super_damage;

			total_missiles = Math.ceil((boss_remaining/100));
			if(total_missiles>missiles){
//				console.log("charge loop");
				total_missiles = missiles;
				boss_remaining -= missile_damage;
				total_charged = Math.ceil((boss_remaining/charge_damage));
				boss_remaining -= (total_charged*charge_damage);
			} else {
				boss_remaining -= (total_missiles*100);
			}
		}

		ammo_totals = [total_missiles, total_supers, total_pbs, total_xfactors, total_charged, only_charged]
//		console.log(ammo_totals);
		if(ammo_damage>=boss){
			willSurvive = true;
		} else if (this.props.beamCombo[0]==1){
			// calculate charge shots needed
			var remainder = boss-ammo_damage;
			total_charged = Math.ceil((remainder/charge_damage));
		} else {
			willSurvive = false;
		}
		
		if(willSurvive){
			dead_alive = (
				<ResultsRidleyLive
					beamCombo={this.props.beamCombo}
					ammoTotals={ammo_totals} 
					ammoCount={this.props.ammoCount} 
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
			);
		} else {
			dead_alive = (
				<ResultsRidleyDie 
					beamCombo={this.props.beamCombo}
					ammoTotals={ammo_totals} 
					ammoCount={this.props.ammoCount} 
					sliderValues={this.props.sliderValues}
					checkboxValues={this.props.checkboxValues}
				 />
			);
		}

		return (
			<div className="results_ridley">
				<h2>Ridley</h2>
				<DeathBanner
					willSurvive={willSurvive} 
				 />
				<img className="ridley_side" src="" alt="Picture of Ridley from Super Metroid" />
				<BossHP
					enemy="Ridley" 
					hp={boss}
				 />
				{dead_alive}
			</div>
		);
	}
}

class ResultsMB extends React.Component {
	render(){
		// logic to decide live die results
//		console.log("ResultsMB");
//		console.log(this.props);
		let ammoTotals = [0,0,0,0,0,0];
		// let mb1Ammo = [0,0,0,0];
		// let mb2Ammo = [0,0,0,0,0];
		var haveCharge = (this.props.beamCombo[0]==1 ? true : false );
		// let have_charge = false;
		// 		
		// if(this.props.beamCombo[0]==1){
		// 	have_charge = true;
		// }
		// 
		// let mb1 = 3000;
		// let mb2 = 18000;
		// let mb1_remaining = mb1;
		// let mb2_remaining = mb2;
		// 
		let missiles = this.props.ammoCount[0];
		let supers = this.props.ammoCount[1];
		let willSurvive = false;
		// 
		// let charge_damage = getChargeDamage(this.props.beamCombo);
		// let missile_damage = missiles*100;
		// let super_damage = supers*300;
		// let supers_needed = 0;
		// let missiles_needed = 0;
		// let charged_shots_needed = 0;
		// let only_charge = Math.ceil((mb2/charge_damage));
		// let ammo_damage = super_damage+missile_damage;
		// let adjusted_missiles = missiles;
		// let adjusted_supers = supers;
		// let adjusted_missile_damage = missile_damage;
		// let adjusted_super_damage = super_damage;
		// let glass_missiles = 0;
		// let glass_supers = 0;

		
		// if(have_charge){
			// if(ammo_damage<mb1){
			// 				// You will die
			// 				willSurvive = false;
			// 			} else {
			// 				// Do you have min 18 projectiles?
			// 				if((supers+missiles)<18){
			// 					willSurvive = false;
			// 				} else {
			// 					// do you have enough for the damage then 6 more to break the glass?
			// 					if(missiles<6 && missiles>0){
			// 						
			// 						adjusted_missiles = 0;
			// 						adjusted_missile_damage = adjusted_missiles*100;
			// 
			// 						adjusted_supers = (supers-(6-missiles));
			// 						adjusted_super_damage = adjusted_supers*300;
			// 						
			// 						glass_missiles = missiles;
			// 						glass_supers = (6-missiles);
			// 						
			// 						ammo_damage = adjusted_super_damage+adjusted_missile_damage;
			// 					}
			// 					if(missiles>=6){
			// 						adjusted_missiles = (missiles-6);
			// 						adjusted_missile_damage = adjusted_missiles*100;
			// 						ammo_damage = super_damage+adjusted_missile_damage;
			// 						
			// 						glass_missiles = 6;
			// 						glass_supers = 0;
			// 					}
			// 					if(supers>=6 && missiles==0){
			// 						adjusted_supers = supers-6;
			// 						adjusted_super_damage = adjusted_supers*300;
			// 						ammo_damage = adjusted_super_damage+missile_damage;
			// 						glass_missiles = 0;
			// 						glass_supers = 6;
			// 					}
			// 					
			// 					if(ammo_damage>=mb1){
			// 						willSurvive = true;
			// 						// calculate ammoTotals
			// 						// if((mb1/300)<=supers){
			// 						// 	supers_total = (mb1/300)+glass_supers;
			// 						// 	missiles_total = glass_missiles;
			// 						// } else {
			// 						// 	supers_total = (supers-glass_supers);
			// 						// 	mb1_remaining -= (supers_total*300);
			// 						// 	missiles_total = (Math.ceil(mb1_remaining/100));
			// 						// 	
			// 						// }
			// 					} else {
			// 						willSurvive = false;	
			// 					}
			// 				}
			// 			}
			
			// (36 - 3*n)*M + n*SM, n element of {0,1,2,3,4,5,6,7,8,9}
			// (8 - n)*M + (10 + n)*SM, n element of {0,1,2,3,4,5,6,7,8}

			// NEED GOOD LOGIC FOR THE AMMO CALCULATIONS
			
			// 
			// mb1Ammo = minAmmoMB1(missiles, supers);
			// if(minAmmo[0] == 0 && minAmmo[1] == 0 ){
			// 	// error, you die
			// 	willSurvive = false;
			// } else {
			// 	// have values, you live
			// 	willSurvive = true;
			// }
			// 
			// 
			// if(willSurvive){
			// 	
			// }
			// ammoTotals[0] = minAmmo[0];
			// ammoTotals[1] = minAmmo[1];
			// ammoTotals[2] = minAmmo[2];
			// ammoTotals[3] = minAmmo[3];


			// need >=18 shots
			// need 6 to break the glass
			// need to do 3000 damage after that
			
			// calculate wasted_shots (missiles first, then supers if <6 missiles)
			// total_ammo-wasted_shots >= 3000
			// 36-0 missiles-, 


		// } else {
			
//			let minAmmoMB = minAmmoMB(missiles, supers, haveCharge);
			
			
			
			// if ammo for MB1 + MB2
				// willSurvive = true;
			// else
				// willSurvive = false;
		// }
//		console.log("survive: " + willSurvive);
		
		
		
		let minAmmoMBResults = minAmmoMB(missiles, supers, this.props.beamCombo);
		ammoTotals[0] = minAmmoMBResults[0];
		ammoTotals[1] = minAmmoMBResults[1];
		ammoTotals[2] = minAmmoMBResults[2];
		ammoTotals[3] = minAmmoMBResults[3];
		ammoTotals[4] = minAmmoMBResults[4];
		
		if(minAmmoMBResults[0]==0 && minAmmoMBResults[1]==0 && minAmmoMBResults[2]==0 && minAmmoMBResults[3]==0 && minAmmoMBResults[4]==0) {
			willSurvive = false;
			ammoTotals[5] = 0;
		} else {
			willSurvive = true;
			ammoTotals[5] = 1;
		}
			
		
		let dead_alive = (
			<ResultsMBDie 
				beamCombo={this.props.beamCombo}
				ammoTotals={ammoTotals}
				ammoCount={this.props.ammoCount} 
				checkboxValues={this.props.checkboxValues}
				sliderValues={this.props.sliderValues}
				willSurvive={false}
			 />
		);
		
		if(willSurvive){
//			console.log("surviveLoop");
			dead_alive = (
				<ResultsMBLive 
					beamCombo={this.props.beamCombo}
					ammoTotals={ammoTotals}
					ammoCount={this.props.ammoCount} 
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
					willSurvive={true}
				 />
			);
		}
		return (
			<div className="results_mb">
				<h2>Mother Brain</h2>
				<DeathBanner
					willSurvive={willSurvive}
				 />
				<BossHP
					enemy="Mother Brain 1" 
					hp={3000}
				 />
				<BossHP
					enemy="Mother Brain 2" 
					hp={18000}
				 />
				{dead_alive}
			</div>
		);
	}
}

class ResultsRidleyLive extends React.Component {
	render(){

		return (
			<div className="results_ridley_live">
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					ammoTotals={this.props.ammoTotals} 
					enemy="ridley" 
					willSurvive={true} 
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
				
				<ChargedShotsResult 
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals} 
					enemy = "ridley"
				 />
				
				<IfYouMiss
					ammoTotals={this.props.ammoTotals} 
					enemy= "ridley" 
					checkboxValues={this.props.checkboxValues}
				 />
			</div>
		);
	}
}

class ResultsRidleyDie extends React.Component {
	render(){

		return (
			<div className="results_ridley_die">
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoTotals={[0,0,0,0,0,0]} 
					ammoCount={this.props.ammoCount} 
					enemy="ridley" 
					willSurvive={false} 
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
				<ChargedShotsResult 
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals} 
					enemy = "ridley"
				 />
			</div>
		);
	}
}

class ResultsMBLive extends React.Component {
	// make button state
	// add remove resultsmb1/2 classes on press
	render(){

		return (
			<div className="results_mb">
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb" 
					willSurvive={true} 
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
				<div className="mb_switcher"></div>
				<ResultsMB1
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					checkboxValues={this.props.checkboxValues} 
					willSurvive={true} 
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb1"
				 />
				<ResultsMB2
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					checkboxValues={this.props.checkboxValues} 
					willSurvive={true} 
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb2"
				 />
			</div>
		);
	}
}

class ResultsMB1 extends React.Component {
	render(){

		return (
			<div className="results_mb1">
				<BossHP
					enemy="Mother Brain 1" 
					hp={3000}
				 />
				<div className="mb1_text"></div>
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb1" 
					willSurvive={this.props.willSurvive}
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}	
				 />
				<IfYouMiss
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb1" 
					checkboxValues={this.props.checkboxValues}
				 />
				<img className="mb_side" src="" alt="Picture of Mother Brain from Super Metroid" />				
			</div>
		);
	}
}

class ResultsMB2 extends React.Component {
	render(){

		return (
			<div className="results_mb2">
				<BossHP
					enemy="Mother Brain 2" 
					hp={18000}
				 />
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount}
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb2" 
					willSurvive={this.props.willSurvive}
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
				<ChargedShotsResult
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb2" 
				 />
				<IfYouMiss
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb2" 
					checkboxValues={this.props.checkboxValues}
				 />
				<img className="mb_side" src="" alt="Picture of Mother Brain from Super Metroid" />				
			</div>
		);
	}
}


class ResultsMBDie extends React.Component {
	render(){

		return (
			<div className="results_mb">
				<BossHP
					enemy="Mother Brain 1" 
					hp={3000}
				 />
				<BossHP
					enemy="Mother Brain 2" 
					hp={18000}
				 />
				<LoadoutContainer
					beamCombo={this.props.beamCombo} 
					ammoCount={this.props.ammoCount} 
					ammoTotals={[0,0,0,0,0,0]} 
					enemy="mb" 
					willSurvive={false}
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
				 />
				<ChargedShotsResult
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals} 
					enemy= "mb2"
				 />
				<img className="mb_side" src="" alt="Picture of Mother Brain from Super Metroid" />				
			</div>
		);
	}
}


class BossHP extends React.Component {
	render(){

		return (
			<div className="boss_hp">
				<span className="boss_name">{this.props.enemy}</span><span> has </span><span className="boss_hp_number">{this.props.hp}</span><span> HP</span>
				<span className="mb1_exception"></span>
			</div>
		);
	}
}

class LoadoutContainer extends React.Component {
	render(){
		let isMB1 = false;
		if(this.props.enemy == "mb1"){
			isMB1 = true;
		}
//		console.log(isMB1);
		let alive_dead;
		if(this.props.willSurvive){
			alive_dead = (
				<LoadoutAlive
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals}
					ammoCount={this.props.ammoCount} 
					enemy={this.props.enemy} 
					isMB1 = {isMB1}
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
					willSurvive={this.props.willSurvive}
				 />
			);	
		} else {
			alive_dead = (
				<LoadoutDead 
					ammoCount={this.props.ammoCount}
					beamCombo={this.props.beamCombo} 
					ammoTotals={this.props.ammoTotals}
					enemy={this.props.enemy} 
					isMB1 = {(this.props.enemy == "mb1")}
					checkboxValues={this.props.checkboxValues}
					sliderValues={this.props.sliderValues}
					willSurvive={this.props.willSurvive}
				 />
			);	
		}
		return (
			<div className="loadout_container">
				{alive_dead}
			</div>
		);
	}
}



class LoadoutAlive extends React.Component {
	renderSwitch(num) {
//		console.log("inside switch: " + num);
	  switch(num) {
	    case 0:
	      return 'missiles';
	    case 1:
	      return 'supers';
	    case 2:
	      return 'pbs';
	    case 3:
	      return 'xfactors';
	    case 4:
	      return 'charged';
	    default:
	      return 'error';
	  }
	}
	render(){
		let pronoun = "her";
		if(this.props.enemy == "ridley"){
			pronoun = "him";
		}
		return (
			<div className="loadout_alive">
				<span className="loadout_heading">With your loadout, you can completely kill {pronoun} with...</span>
				{this.props.ammoTotals.map((ammo, num) => {
					{if(this.props.enemy=="ridley" && ammo != 0 && num<5){
						return (<LoadoutItem
							key={num} 
							number={ammo} 
							weapon={this.renderSwitch(num)}
							isMB1={this.props.isMB1} 
							willSurvive={this.props.willSurvive}
							enemy={this.props.enemy} 
						 />);
					} else if (this.props.isMB1 && ammo != 0 && num<2){
						return (<LoadoutItem
							key={num} 
							number={ammo} 
							weapon={this.renderSwitch(num)}
							isMB1={this.props.isMB1} 
							willSurvive={this.props.willSurvive}
							glassMissiles={this.props.ammoTotals[2]} 
							glassSupers={this.props.ammoTotals[3]} 
							enemy={this.props.enemy} 
						 />);
					}
				}
				})}
			</div>
		);
	}
}

class LoadoutDead extends React.Component {
	renderSwitch(num) {
//		console.log("inside switch: " + num);
	  switch(num) {
	    case 0:
	      return 'missiles';
	    case 1:
	      return 'supers';
	    case 2:
	      return 'pbs';
	    case 3:
	      return 'xfactors';
	    case 4:
	      return 'charged';
	    default:
	      return 'error';
	  }
	}
	render(){

		let missiles = this.props.ammoCount[0];
		let supers = this.props.ammoCount[1];
		let pbs = this.props.sliderValues[0];
		let xfactors = this.props.sliderValues[1];
		
		let missile_damage = 100*missiles;
		let super_damage = 600*supers;
		let pb_damage = 200*pbs;
		let xfactor_damage = 1200*xfactors;
		
		let ammoNeeded = [0,0,0,0,0];
		let boss;
		let boss_remaining;
//		let ammo_damage = 0;
		let ridley_ammo_damage = missile_damage + super_damage + pb_damage + xfactor_damage;
		let mb_ammo_damage = missile_damage + super_damage;
		let charge_damage =  getChargeDamage(this.props.beamCombo);
		
		if(this.props.enemy == "ridley"){
			boss = 18000;
			boss_remaining = boss;
//			ammo_damage = ridley_ammo_damage;
			boss_remaining -= ridley_ammo_damage;
			let supers_needed = Math.ceil(boss_remaining/600);
			let missiles_needed = Math.ceil(boss_remaining/100);
			let pbs_needed = 0;
			let xfactors_needed = 0;
			if(this.props.checkboxValues[0]==1){
				pbs_needed = Math.ceil(boss_remaining/200);
			}
			if(this.props.checkboxValues[1]==1){
				xfactors_needed = Math.ceil(boss_remaining/1200);
			}
			let charged_shots_needed = Math.ceil(boss_remaining/charge_damage);
			ammoNeeded = [missiles_needed, supers_needed, pbs_needed, xfactors_needed, charged_shots_needed];
		} else {
//			ammo_damage = mb_ammo_damage
		}
		
		
		

		return (
			<div className="loadout_dead">
				<span className="loadout_heading">With your loadout, you would still need...</span>
				{ammoNeeded.map((ammo, num) => {
					{
						if(ammo != 0 && num<5){
							return (
								<LoadoutItem
									key={num} 
									number={ammo} 
									weapon={this.renderSwitch(num)}
									isMB1={this.props.isMB1}
									willSurvive={this.props.willSurvive}
									enemy={this.props.enemy} 
						 		 />
						);
								
						}
					}
				})}
			</div>
		);
	}
}

class LoadoutItem extends React.Component {

	
	render(){
		
		let mb1 = "";
		let mb1Text = "";

		if(this.props.isMB1){
			console.log("inside mb1");
			console.log(this.props.enemy);
			console.log(this.props.glassMissiles);
			console.log(this.props.glassSupers);
//			if(this.props.glassMissiles && this.props.glassSupers){
				console.log("they do exist");
				if(this.props.glassMissiles>0 && this.props.glassSupers>0){
//					console.log("inside mb1 missiles+supers");
					if(this.props.weapon=="missiles" || this.props.weapon=="supers"){
						mb1Text = "plus " + this.props.glassMissiles + " missiles and " + this.props.glassSupers + "supers to break the glass.";
					}
				} else if(this.props.glassMissiles==0 && this.props.glassSupers>0){
//					console.log("inside mb1 supers");
					if(this.props.weapon=="supers"){
						mb1Text = "plus " + this.props.glassSupers + " supers to break the glass.";
					}
				} else if(this.props.glassMissiles>0 && this.props.glassSupers==0){
//					console.log("inside mb1 missiles");
					if(this.props.weapon=="missiles"){
						mb1Text = "plus " + this.props.glassMissiles + " missiles to break the glass.";
					}
				}
//			}

		}
		

		
		let orTag = (<span className="block">or</span>);
		if(this.props.willSurvive){
			orTag = "";
		}
//		console.log("LOADOUTITEM weapon index " + this.props.weaponIndex);
		return (
			<div className="loadout_item">
				<span className="item_number">{this.props.number}</span>
				<span className="item_type">{this.props.weapon}</span>
				{mb1Text}
				{orTag}
			</div>
		);
	}
}



class ChargedShotsResult extends React.Component {
	render(){
		let header_text = "If you only use charged shots";
		// allow for mb1 text exception here
		
		var charge_damage = getChargeDamage(this.props.beamCombo);
		var boss = 18000;

		var number = Math.ceil(boss/charge_damage);
		return (
			<div className="charged_shots_result">
				<span className="charged_header">{header_text}</span>
				<LoadoutItem
					number={number}  
					weapon="Charged Shots" 
					isMB1="" 
					willSurvive={true}
				 />
			</div>
		);
	return ("");
	}
}

// function addClass(componentThis, newClass, targetClass){
// 	var internals = componentThis._reactInternals;
// 	console.log(internals);
// 	if(internals.child){
// 		console.log("has child");
// 		var child = internals.child;
// 		var classnames = child.memoizedProps.className;
// 		if(classnames == targetClass){
// 			child.memoizedProps.className = classnames+" "+newClass;
// 		}
// 	}
// }

class IfYouMiss extends React.Component {
	render(){
		
//		addClass(this, "testo", "if_you_miss");
		
		let all_items = "";
		let pbs = "";
		let charged = "";
		
		if(this.props.ammoTotals){
			charged = this.props.ammoTotals[5];
		}
		
		if(this.props.enemy == "ridley"){

			if(this.props.checkboxValues[0]==1){
				all_items = (
					<ul>
					<li><LoadoutItem
						number="6"
						weapon="Missiles"
						isMB1={false}
					 /></li>
					<li><LoadoutItem
						number="3"
						weapon="PB hits"
						isMB1={false}
					 /></li>
					<li><LoadoutItem
						number={charged}
						weapon="Charged Shots"
						isMB1={false}
					 /></li>
					</ul>
				);
			} else {
				all_items = (
					<ul>
					<li><LoadoutItem
						number="6"
						weapon="Missiles"
						isMB1={false}
					 /></li>
					<li><LoadoutItem
						number={charged}
						weapon="Charged Shots"
						isMB1={false}
					 /></li>
					</ul>
				);
			}
	
		} else if(this.props.enemy == "mb2"){
			all_items = (
				<ul>
				<li><LoadoutItem
					number="3"
					weapon="Missiles"
					isMB1={false}
				 /></li>
				<li><LoadoutItem
					number={charged}
					weapon="Charged Shots"
					isMB1={false}
				 /></li>
				</ul>
			);
		} else {
			all_items = (
				<ul>
				<li><LoadoutItem
					number="3"
					weapon="Missiles"
					isMB1={false}
				 /></li>
				</ul>
			);
		}

		return (
			<div className="if_you_miss">
				<span className="if_you_miss_heading">If you miss a super, you will need...</span>
				{all_items}
			</div>
		);
	}
}

class DeathBanner extends React.Component {
	render(){
		let banner_message;
		if(this.props.willSurvive){
			banner_message = (<h2 className="you_live">YOU'RE ALL GOOD...</h2>);
			//'
		} else {
			banner_message = (<h2 className="you_die">YOU WILL DIE...</h2>);
		}
		return (
			<div className="death_banner">
				{banner_message}
			</div>
		);
	}
}

export default App;
