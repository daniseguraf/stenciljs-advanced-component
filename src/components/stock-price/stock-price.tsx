import { Component, State, h } from '@stencil/core'

@Component({
  tag: 'uc-stock-price',
  styleUrl: 'stock-price.css',
  shadow: true
})

export class StockPrice {
  @State() fetchedPrice: number

  onFetchStockPrice = (e: Event) => {
    e.preventDefault();
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo`)
    .then((res) => {
      return res.json();
    })
    .then(parsedRes => {
      console.log(parsedRes);
      this.fetchedPrice = +parsedRes['Global Quote']['05. price']
      console.log(this.fetchedPrice);
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" type="text"/>
        <button type="submit">Fetch Data</button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrice} </p>
      </div>
    ]
  }
}