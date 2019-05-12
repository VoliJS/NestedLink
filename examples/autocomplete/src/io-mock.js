export function doSomething( filter ){
    return new Promise( resolve => {
        setTimeout( () => {
            resolve([{
                id: 1,
                name : 'Vlad Balin',
                email : 'vb@mail.co'
            },
            {
                id: 2,
                name : 'Vitaly Tsirulnikov',
                email : 'vt@mail.co'
            },{
                id: 3,
                name : 'Pavel Smirnov',
                email : 'ps@mail.co'
            }])
        }, 1000 )
    })
}
