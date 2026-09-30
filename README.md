# DOM Store Management

## How to open

I open `index.html` directly in a web browser, or I run the project in Visual Studio Code with the Live Server extension.

## What was implemented

I handle the `submit` event to validate the product fields and add valid products without reloading the page. I handle the `click` event for product actions, and I use event delegation so one listener on the products list handles every increase, decrease, and delete button. I use `DOMContentLoaded` to initialize the store, load the sample products, and render the page after its HTML has loaded. I recalculate and display the live total after each inventory change so I can see the updated value immediately.

## Screenshot

![Product Store](screenshot.png)

## AI Tools

I used ChatGPT to assist with code structure, debugging, and explanation.
