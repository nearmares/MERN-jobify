import React from 'react'
import {Logo} from '../components'
import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAppContext } from  '../context/appContext'


const Landing = () => {
    
    const navigate = useNavigate()

    const { user } = useAppContext()

    return (
        <>
            { user && <Navigate to='/' />}
            <Wrapper>
                <nav>
                    <Logo/>
                </nav>
                <div className='container page'>
                    <div className='info'>
                        <h1>
                            job <span>tracking</span> app
                        </h1>
                        <p>
                        Fam you probably haven't heard of them live-edge, same vegan kickstarter lo-fi everyday carry sustainable cronut skateboard. You probably haven't heard of them Brooklyn hella, tousled trust fund kombucha bicycle rights af. Before they sold out fanny pack tattooed, hell of same godard raclette. Shabby chic vape affogato schlitz. Chia fixie JOMO, celiac green juice whatever same swag 8-bit food truck brunch 3 wolf moon. Man braid pour-over plaid, literally yr four dollar toast fingerstache big mood enamel pin franzen synth. Hella ugh bitters, typewriter hot chicken polaroid dreamcatcher tote bag hashtag narwhal VHS gochujang.
                        </p>
                        <button className="btn btn-hero" onClick={() => navigate('/register')}>Login/register</button>
                    </div>
                    <img src={main} alt='job hunt' className='img main-img'/>
                </div>
            </Wrapper>
        </>
    )
}

export default Landing