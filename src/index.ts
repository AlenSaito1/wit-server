import App from './App'

const app = new App()


app.on('ready', () => app.log('App Started'))
app.on('server-ready', (PORT: number) => app.log(`Server Started on PORT ${PORT}`))
app.on('detector-ready', () => app.log(`Detector Started`))

app.start()
