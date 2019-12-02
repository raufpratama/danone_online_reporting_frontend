import color from '../../assets/utils/colors'

const app = {}
app.text = (statusKode) =>{
    let status = ''
    switch (statusKode) {
        case 1 :
            status = 'Open'
        break
        case 2 : 
            status = 'Working'
        break
        case 3 : 
            status = 'Submitted'
        break
        case 4 :
            status = 'Completed'
    }
    return status
}

app.color = (statusKode) => {
    let badgeColor = ''
    switch (statusKode) {
        case 1 :
            badgeColor = color.hijau_benar
        break
        case 2 : 
            badgeColor = color.kuning
        break
        case 3 : 
            badgeColor = color.abu_placeholder
        break
        case 4 :
            badgeColor = color.blue_link
    }
    return badgeColor
}

module.exports = app