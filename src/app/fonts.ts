import localFont from 'next/font/local';

export const sfPro = localFont({
  src: [
    {
      path: './fontAssets/SFPRODISPLAYBLACKITALIC.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: './fontAssets/SFPRODISPLAYBOLD.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fontAssets/SFPRODISPLAYHEAVYITALIC.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fontAssets/SFPRODISPLAYLIGHTITALIC.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fontAssets/SFPRODISPLAYMEDIUM.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fontAssets/SFPRODISPLAYREGULAR.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fontAssets/SFPRODISPLAYSEMIBOLDITALIC.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fontAssets/SFPRODISPLAYTHINITALIC.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: './fontAssets/SFPRODISPLAYULTRALIGHTITALIC.otf',
      weight: '200',
      style: 'italic',
    }
  ],
  display: 'swap'
})