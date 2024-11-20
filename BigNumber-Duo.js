class BigNumberDuo extends HTMLElement {

  set hass(hass) {
    this._hass = hass;
    // Update the card in case anything has changed
    if(!this._config) return; // Can't assume setConfig is called before hass is set

      const entityId = this._config.entity;
      const entityId2 = this._config.entity2;
      const title = this._config.title;
      const icon = this._config.icon;
      const icon2 = this._config.icon2;
      const iconSource = this._config.iconSource;
      const iconSource2 = this._config.iconSource2;
      const color = this._config.color;
      const color2 = this._config.color2;
      const canGoBelowZero = this._config.CanGoBelowZero;
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

      this.divTitle.innerHTML = title;
      this.div1.innerHTML = `${iconText}${valueColor}&nbsp;<small>${unitOfMeasurement}</small>`;
      this.div1.addEventListener("click", () => 
      {
        const actionConfig = {
          entity: entityId,
          tap_action: {
            action: "more-info",
          }
        };

        const event = new Event("hass-action", {
          bubbles: true,
          composed: true,
        });
        event.detail = {
          config: actionConfig,
          action: "tap",
        };
        this.div1.dispatchEvent(event);
      });

      this.div2.innerHTML = `${iconText2}${valueColor2}&nbsp;<small>${unitOfMeasurement2}</small>`;
      this.div2.addEventListener("click", () => 
        {
          const actionConfig = {
            entity: entityId2,
            tap_action: {
              action: "more-info",
            }
          };
          const event = new Event("hass-action", {
            bubbles: true,
            composed: true,
          });
          event.detail = {
            config: actionConfig,
            action: "tap",
          };
          this.div2.dispatchEvent(event);
        });

      this.styleSheet.innerHTML = `
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
        }`;
    }
  
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) 
    {
      this._config = config;

      if (!config.entity) {
        throw new Error('You need to define an entity');
      }
      if (!config.entity2) {
        throw new Error('You need to define a second entity');
      }
      if (!config.title) {
        throw new Error('You need to define an title');
      }
      

      // Make sure this only runs once
      if(!this.setupComplete) {
        // A ha-card element should be the base of all cards
        // Best practice, and makes themes and stuff work
        const card = document.createElement("ha-card");
        
        // At this point, we don't necessarily know anything about the current state
        // of anything, but we can set up the general structure of the card.
        this.nameDiv = document.createElement("div");
        card.appendChild(this.nameDiv);
        
        this.linebreak = document.createElement('br');
        card.appendChild(this.linebreak);
        
        this.divTitle = document.createElement('div');
        this.divTitle.id = "title";
        //divTitle.content = title;
        card.appendChild(this.divTitle);

        this.linebreak2 = document.createElement('br');
        card.appendChild(this.linebreak2);

        this.div1 = document.createElement('div');
        this.div1.id = "value";
        card.appendChild(this.div1);
        
        this.div2 = document.createElement('div');
        this.div2.id = "value";
        card.appendChild(this.div2);
        
        this.styleSheet = document.createElement('style');
        card.appendChild(this.styleSheet);

        this.appendChild(card);
        
        this.setupComplete = true;
      }
    }
  
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 2;
    }
  }
  
  customElements.define('bignumber-duo', BigNumberDuo);
