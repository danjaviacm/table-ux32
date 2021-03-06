import React, { PropTypes, Component } from 'react'
import ReactDOM, { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { default as Router, NotFoundRoute, Route, RouteHandler, Link, IndexRoute, browserHistory, hashHistory } from 'react-router'
import Pusher from 'pusher-js'

import PolicyList from './components/policy_list'
import Ux3Services from './services/Ux3Services'
import Ux3Func from './services/Ux3Func'
import $ from 'jquery'
import { KEY_PUSHER } from './constants/AppConstants.js'
import { Modal, Button, Carousel, CarouselItem } from 'react-bootstrap'
import aseguradoras from './services/Aseguradoras'
import Navbar from './components/navbar'
import store from 'store2'
import styles from './styles/main.less'

import Woopra from 'woopra'

let woopra = new Woopra( 'cmtest.com', {} );

class QuoteTable extends Component {

   	constructor ( props, context ) {

   		super ( props )

   		this.state = {
            policies: [],
            asc: true,
            showModal: true,
            controls: false,
            indicators: false,
            opportunity_id: '',
            opp_id: ''
        }

        context.router
   	}

    funct(data) {
        this.state.policies = data
        this.setState({policies: data})
    }

    sortPusher(prop){
        let asc = true;
        let list_sort = this.state.policies.sort(function (a, b) {
            if (asc){
                return (a[prop] == b[prop]) ? 0 : ((a[prop] > b[prop]) ? 1 : -1);
            }else {
                return (a[prop] == b[prop]) ? 0 : ((a[prop] < b[prop]) ? 1 : -1);
            }
        });
        this.setState({
            policies: list_sort,
            asc: asc
        });
    }

    sortList(prop){
    	console.log(this.state)
        let asc = !this.state.asc;
        let list_sort = this.state.policies.sort(function (a, b) {
            if (asc){
                return (a[prop] == b[prop]) ? 0 : ((a[prop] > b[prop]) ? 1 : -1);
            }else {
                return (a[prop] == b[prop]) ? 0 : ((a[prop] < b[prop]) ? 1 : -1);
            }
        });
        this.setState({
            policies: list_sort,
            asc: asc
        });
    }

    componentWillMount() {
        let code1 = window.location.href
        // console.log(code1);
        let code = code1.match(/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/)
        let local_polilicies = aseguradoras;

        if(localStorage.showModal){
            if(localStorage.showModal=='true'){
                this.setState({showModal: false});
            }else{
                this.setState({showModal: false});
            }

        }else{
            localStorage.setItem('showModal', 'true');
            this.setState({showModal: true});
        }

        Ux3Services.getAllPolicies(code[0])
            .then((data) => {
                // console.log( data )
                let opportunity_id = '';
                data.map((obj) => {
                    if(obj.error){
                        obj.default = true;
                    }
                    if(obj.opportunity_id){
                        opportunity_id = obj.opportunity_id;
                    }
                    local_polilicies.push(obj)
                    local_polilicies = this.dropKeyByDefault(obj, local_polilicies)
                })

                this.setState({
                    policies: local_polilicies,
                    opp_id: opportunity_id
                })

                if ( ! localStorage.opp_id ) {
                    if ( opportunity_id != null ) {
                        let pusher = new Pusher(KEY_PUSHER)
                        let channel = pusher.subscribe('car-comparison-table-' + opportunity_id)
                        channel.bind('quoted_policy', function (data) {
                            // console.log( data )
                            let local_polilicies = this.state.policies;
                            local_polilicies.push(data);
                            local_polilicies = this.dropKeyByDefault(data, local_polilicies)
                            //local_polilicies
                            this.funct(local_polilicies)
                            this.sortPusher('price_total_without_formatting')
                        }.bind(this))
                    }
                }

            }).catch((error) => {
                // console.log(error)
            })

        if ( localStorage.opp_id ) {

            let opp_id = JSON.parse( store.get( 'opp_id' ) )

            if ( localStorage.opp_id != null ) {
                let pusher = new Pusher(KEY_PUSHER)
                let channel = pusher.subscribe('car-comparison-table-' + opp_id.opp_id)
                channel.bind('quoted_policy', function (data) {
                    // console.log( data )
                    let local_polilicies = this.state.policies;
                    local_polilicies.push(data);
                    local_polilicies = this.dropKeyByDefault(data, local_polilicies)
                    //local_polilicies
                    this.funct(local_polilicies)
                    this.sortPusher('price_total_without_formatting')
                    // console.log(pol)
                }.bind(this))
            }
        }

    }

    dropKeyByDefault(key, data) {
        let keydrop = false;
        data.forEach(function (obj, i) {
            if (key.insurance_company_code == obj.insurance_company_code) {
                if (obj.default) {
                    keydrop = i;
                }
            } 

            else {
                obj.error_message = key.error_message
            }
        });
        if (keydrop !== false) {
            delete data[keydrop]
        }

        return data.filter(function (val) {
            return val
        });
    }

    componentDidMount() {
        
        let code1 = window.location.href

		let code = code1.match(/[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/)

        woopra.identify( code[0], {
		    uuid: code[0],
		    email: 'test@mail.com'
		}).push()

		woopra.track( 'Opportunity capture', {
		    eventProperty: 'rarezas mago de oz'
		});
        
        let opp_id = this.state.opp_id

        $('.loading-bar').animate({
            width: '100%'
        }, 60000, () => {
            $('.loading-bar').addClass('completed');
        })

        setTimeout(function () {
            localStorage.setItem('showModal', 'false');
            this.setState({
                showModal: false
            });
        }.bind(this), 15000)

    }

    close() {
        this.setState({showModal: false})
    }

    render() {
        return (
            <div>
                <Modal bsClass="modal" dialogClassName="carouselCont" show={this.state.showModal} onHide={this.close}>
                    <Modal.Body>
                        <Carousel controls={this.state.controls} indicators={this.state.indicators}>
                            <CarouselItem>
                                <img
                                    src="http://segdig1.s3.amazonaws.com/static/core-app/img/applications/loadingux3-1/post1.png"/>
                                <ul className="listModal text-center">
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/allianz.svg"
                                        alt="Allianz"/>
                                    </li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/sura.svg"
                                        alt="Sura"/></li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/generali.svg"
                                        alt="Generali"/>
                                    </li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/equidad.svg"
                                        alt="Equidad Seguros"/></li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/previsora.svg"
                                        alt="Previsora"/></li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/seguros-del-estado.svg"
                                        alt="Seguros del Sstado"/></li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/mundial.svg"
                                        alt="Mundial Seguros"/></li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/aig.svg"
                                        alt="AIG Seguros"/>
                                    </li>
                                    <li><img
                                        src="https://segdig1.s3.amazonaws.com/static/core-app/img/logos/insurance-companies/vector/color/solidaria.svg"
                                        alt="Solidaria"/></li>
                                </ul>
                            </CarouselItem>
                            <CarouselItem>
                                <img
                                    src="http://segdig1.s3.amazonaws.com/static/core-app/img/applications/loadingux3-1/post2.png"/>
                            </CarouselItem>
                        </Carousel>
                    </Modal.Body>
                </Modal>

                <Navbar />

                <div className="quote-table-cars">
                    <div className="loading-bar"></div>
                    <PolicyList list={this.state.policies} sortList={this.sortList.bind(this)}/>
                    <div className="terms">
                        <span>Oportunidad: {this.state.opp_id}</span>
                        <br/>
                        Aunque en la gran mayoría de casos nuestras cotizaciones cuentan con datos precisos, la
                        información
                        mostrada
                        en esta página esta sujeta a corroboración. La oferta final de cada compañía puede variar en
                        costo y
                        condiciones de cobertura debido a características específicas de cada persona. Se deja
                        constancia
                        que toda
                        la información brindada es de referencia y no genera ninguna obligación legal. Ver
                        <a href="https://comparamejor.com/co/terminos-y-condiciones/" target="_blank"> Términos de Uso</a> para mayor
                        información.
                    </div>
                </div>
            </div>
        )
    }
}

QuoteTable.contextTypes = {
    router: React.PropTypes.func.isRequired
}

let routes = (
    <Route>
        <Route name="final_table" path=":uuid/" handler={QuoteTable}/>
    </Route>
)

React.render(<QuoteTable/>, document.getElementById('content'))