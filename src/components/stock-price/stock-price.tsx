import { Component, Prop, State, Element, Watch, h } from '@stencil/core'

import {AV_API_KEY} from './../../global/global'

@Component({
  tag: 'uc-stock-price',
  styleUrl: 'stock-price.css',
  shadow: true
})

export class StockPrice {
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  @Prop({mutable: true, reflectToAttr: true}) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if(newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue)
    }
  }

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;

    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    }else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice = (e: Event) => {
    e.preventDefault();
    this.stockSymbol = this.stockInput.value;
  }

  componentDidLoad() {
    if(this.stockSymbol) {
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol)
    }
  }

  fetchStockPrice = (stockSymbol: string) => {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then((res) => {
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid symbol!')
        }

        this.error = null;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price']
      })
      .catch(err => {
        this.error = err.message;
      })
  }

  render() {
    let dataContent = <p>Price: ${this.fetchedPrice} </p>;
    if(this.error) {
      dataContent = <p>{this.error}</p>
    }

    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input
          id="stock-symbol"
          ref={(el) => this.stockInput = el }
          value={this.stockUserInput}
          onInput={this.onUserInput}
        />
        <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
  }
}
