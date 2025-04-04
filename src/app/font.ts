import localFont from 'next/font/local';

export const sfPro = localFont({
  src: [
    {
      path: './fonts/SFPRODISPLAYBLACKITALIC.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: './fonts/SFPRODISPLAYBOLD.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SFPRODISPLAYHEAVYITALIC.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/SFPRODISPLAYLIGHTITALIC.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/SFPRODISPLAYMEDIUM.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/SFPRODISPLAYREGULAR.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SFPRODISPLAYSEMIBOLDITALIC.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/SFPRODISPLAYTHINITALIC.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: './fonts/SFPRODISPLAYULTRALIGHTITALIC.otf',
      weight: '200',
      style: 'italic',
    }
  ],
  display: 'swap'
})