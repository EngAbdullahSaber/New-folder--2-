import type { SVGAttributes } from 'react'

const ADILLALOGO = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg id='Layer_2' data-name='Layer 2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 49.89 33.03' {...props}>
      <defs>
        <style>
          {`
            .cls-1 {
              fill: #4848a8;
            }
            .cls-2 {
              fill: #c9a275;
            }
            .cls-3 {
              fill: #c1c1c1;
            }
          `}
        </style>
      </defs>
      <g id='Layer_1-2' data-name='Layer 1'>
        <g>
          <path
            className='cls-1'
            d='M0,29.79C3.5,20.6,11.83,12.44,24.79,5.49l.15-.08.15.08c12.97,6.95,21.29,15.11,24.79,24.3-1.81-11.43-10.19-21.44-24.94-29.79C10.19,8.35,1.81,18.36,0,29.79Z'
          />
          <path
            className='cls-2'
            d='M45.1,31.19c-2.97-6.8-9.69-12.85-20.01-18.01l-.14-.07-.14.07C14.48,18.34,7.76,24.39,4.79,31.19c1.66-8.43,8.42-15.83,20.15-22.03,11.73,6.2,18.5,13.6,20.15,22.03Z'
          />
          <path
            className='cls-3'
            d='M40.92,33.03c-2.5-4.99-7.81-9.44-15.84-13.25l-.13-.06-.13.06c-8.03,3.81-13.34,8.26-15.84,13.25,1.51-6.16,6.87-11.58,15.97-16.16,9.1,4.57,14.46,10,15.97,16.16Z'
          />
        </g>
      </g>
    </svg>
  )
}

export default ADILLALOGO
