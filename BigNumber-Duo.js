class BigNumberDuo extends HTMLElement {
  
  _fire(type, detail, options) {
    const node = this.content;
    options = options || {};
    detail = (detail === null || detail === undefined) ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
  }
  
  set hass(hass) {
      // Initialize the content if it's not there yet.
      if (!this.content) {

        const card = document.createElement('HA-card');
        this.content = document.createElement('div');
        //this.content.style = 'card-content';
        this.style.textAlign = 'center';
        this.content.style.display = 'inline-block';
        card.appendChild(this.content);
        card.addEventListener('click', event => {
          this._fire('hass-more-info', { entityId: this.config.entity });
        });
        this.appendChild(card);
        
        var content = this.content;
        /*this.innerHTML = `
          <ha-card>
            <div class="card-content"></div>
          </ha-card>
        `;*/
        //this.content = this.querySelector('div');
      }
  
      const entityId = this.config.entity;
      const entityId2 = this.config.entity2;
      const title = this.config.title;
      const icon = this.config.icon;
      const icon2 = this.config.icon2;
      const iconSource = this.config.iconSource;
      const iconSource2 = this.config.iconSource2;
      const color = this.config.color;
      const color2 = this.config.color2;
      const canGoBelowZero = this.config.CanGoBelowZero;
      const entityState = Math.round(+hass.states[entityId].state * 10) / 10;
      const entityState2 = Math.round(+hass.states[entityId2].state * 10) / 10;

      var theValue = entityState;
      if (!canGoBelowZero && theValue < 0)
      {
        theValue = 0;
      }

      var theValue2 = entityState2;
      if (!canGoBelowZero && theValue2 < 0)
      {
        theValue2 = 0;
      }
      
      var iconText = "";
      
      if (icon)
      {
        var iconSourcePrefix = "mdi";
        if (iconSource)
        {
          if (iconSource == "awesome")
            iconSourcePrefix = "fas";
        } 
        iconText = "<ha-icon icon=\"" + iconSourcePrefix + ":" + icon + "\"></ha-icon>&nbsp;";
      }
      var iconText2 = "";
      
      if (icon2)
      {
        var iconSourcePrefix2 = "mdi";
        if (iconSource2)
        {
          if (iconSource2 == "awesome")
            iconSourcePrefix2 = "fas";
        } 
        iconText2 = "<ha-icon icon=\"" + iconSourcePrefix2 + ":" + icon2 + "\"></ha-icon>&nbsp;";
      }

      var valueColor = theValue;
      if (color)
      {
        valueColor = "<font color=\"" + color + "\">" + theValue + "</font>";
      }
      var valueColor2 = theValue2;
      if (color2)
      {
        valueColor2 = "<font color=\"" + color2 + "\">" + theValue2 + "</font>";
      }

      const unitOfMeasurement = hass.states[entityId].attributes["unit_of_measurement"];
      const unitOfMeasurement2 = hass.states[entityId2].attributes["unit_of_measurement"];
  
      this.content.innerHTML = `
      <br/>
      <div id="title">${title}</div>
      <br/>
      <div id="value">${iconText}${valueColor}&nbsp;<small>${unitOfMeasurement}</small></div>
      <div id="value">${iconText2}${valueColor2}&nbsp;<small>${unitOfMeasurement2}</small></div>
      <style>
        #value
        {
          font-size: 65px;
          line-height: 65px;
          text-align: center;
          font-weight: bold;
        }
        #value small
        {
          opacity: 0.5;
          font-size: 32px;
          font-weight: bold;
        }
        #title {
          font-weight: bold;
          font-size: 28px;
          text-align: center;
          line-height: 28px;
        }
      </style>
      `;

      
    }
  
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.entity) {
        throw new Error('You need to define an entity');
      }
      if (!config.entity2) {
        throw new Error('You need to define a second entity');
      }
      if (!config.title) {
        throw new Error('You need to define an title');
      }
      this.config = config;
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 2;
    }
  }
  
  customElements.define('bignumber-duo', BigNumberDuo);
