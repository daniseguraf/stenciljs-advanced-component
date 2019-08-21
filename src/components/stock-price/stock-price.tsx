import { Component, h } from '@stencil/core'

@Component({
  tag: 'uc-stock-price',
  styleUrl: 'stock-price.css',
  shadow: true
})

export class StockPrice {
  render() {
    return (
      <p>Stock Price</p>
    )
  }
}