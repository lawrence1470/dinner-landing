'use client'

import React, { useEffect, useState, useRef } from 'react'
import styles from "./SliderDemo.module.css"
import IMG_3456 from '../../public/images/IMG_3480.jpg'
import IMG_3457 from './../public/images/IMG_7634.jpg'
import Dinner_Jazz from './../public/images/Dinner_Jazz.jpg'
import Dinner_Jazz_2 from './../public/images/Engagement Party-5.jpg'
import BookingImageBackground from "./../public/images/IMG_3555.png"
import BookingImage from './../public/images/IMG_3553.png'
import Cuisines from './../public/images/IMG_8713.jpg'
import CuisinesBackground from './../public/images/IMG_0275.jpg'

import Image from "next/image";

const slidesData = [
    {
        backgroundImage: IMG_3456,
        slideImage: IMG_3457,
        titleText: 'A Membership For Food',
        subtitle: 'Our app makes it easy to book dinner parties across NYC, allowing you to meet new people and have a great time. You can explore various themed parties hosted in different neighborhoods, secure your spot with a simple booking process, and connect with other guests.',
        accentColor: '#B64763',
        url: 'https://theuselessweb.com'
    },
    {
        backgroundImage: CuisinesBackground,
        slideImage: Cuisines,
        titleText: 'Try New Cuisines',
        subtitle: 'Explore different restaurants at the tap of a button. We post weekly event offerings. Experience an intimate omakase dinner with a small group or a large-scale dinner party served family style. This membership is for people who love food.',
        accentColor: '#554EA5',
        url: 'https://theuselessweb.com'
    },
    {
        backgroundImage: BookingImageBackground,
        slideImage: BookingImage,
        titleText: 'Book experiences',
        subtitle: "Book experiences at restaurants. Members enjoy discounted prices at our restaurant partners. Enjoy events like unlimited mimosas for a Sunday brunch or a three-course dinner date. Invite your friends or go alone!",
        accentColor: '#00b84f',
        url: 'https://theuselessweb.com'
    },
    {
        backgroundImage: Dinner_Jazz_2,
        slideImage: Dinner_Jazz,
        titleText: 'Private Dining Events',
        subtitle: "Experience a unique private dining occasion that elevates a meal into an extraordinary event. Our private chef experience occurs in distinctive dining venues and offers a seasonal or contemporary take on traditional menus.",        accentColor: '#C3926E',
        url: 'https://theuselessweb.com'
    }
];

function Hero() {
    const [slides, setSlides] = useState([...slidesData])
    const [activeSlideIndex, setActiveSlideIndex] = useState(0)
    const [activeSlideFractionalIndex, setActiveSlideFractionalIndex] = useState(0.0)
    const [autoControlFractional, setAutoControlFractional] = useState(true)
    const [mouseDown, setMouseDown] = useState<null | { x: number; y: number; originalFractionalIndex: number }>(null)
    const preventNextClick = useRef(false)
    const multiFrameCount = useRef(0)

    useEffect(() => {
        document.title = 'Slide Demo';
    }, [])

    function moreSlides() {
        setSlides(prev => [
            ...prev,
            ...slidesData, ...slidesData, ...slidesData, ...slidesData,
            ...slidesData, ...slidesData, ...slidesData, ...slidesData, ...slidesData
        ])
    }

    function goToSlide(index: number) {
        if (index < 0) index = 0
        if (index >= slides.length - 3) {
            const distance = Math.abs(index - slides.length)
            const addCount = Math.ceil(distance / slidesData.length / 9)
            for (let i = 0; i < addCount; i++) {
                moreSlides()
            }
        }
        setActiveSlideIndex(index)
    }


    function calculateSpeed(x: number): number {
        const isNegative = x < 0
        if (isNegative) x = x * -1

        let result = x < 0.5 ? 4 * x : -4 * x + 4
        if (x > 0.97) {
            result = 0.12
        }
        return isNegative ? result * -1 : result
    }

    useEffect(() => {
        moreSlides()
    }, [])

    function dragEnd() {

        goToSlide(Math.round(activeSlideFractionalIndex))
        setMouseDown(null)
        setAutoControlFractional(true)
    }

    function handleMouseDown(event: React.MouseEvent) {
        setMouseDown({
            x: event.clientX,
            y: event.clientY,
            originalFractionalIndex: activeSlideFractionalIndex
        });
        setAutoControlFractional(false)
        preventNextClick.current = false
    }

    function handleTouchStart(event: React.TouchEvent) {
        const touch = event.touches[0]
        if (touch) {
            setMouseDown({
                x: touch.clientX,
                y: touch.clientY,
                originalFractionalIndex: activeSlideFractionalIndex
            });
            setAutoControlFractional(false);
            preventNextClick.current = false;
        }
    }

    function handleMouseMove(event: React.MouseEvent) {
        if (mouseDown) {
            const distanceX = mouseDown.x - event.clientX;
            if (Math.abs(distanceX) > 2) {
                preventNextClick.current = true;
            }
            const multiplier = 0.004;
            setActiveSlideFractionalIndex(mouseDown.originalFractionalIndex + multiplier * distanceX);
        }
    }

    function handleTouchMove(event: React.TouchEvent) {
        if (mouseDown) {
            const touch = event.touches[0]
            if (touch) {
                const distanceX = mouseDown.x - touch.clientX;
                if (Math.abs(distanceX) > 2) {
                    preventNextClick.current = true;
                }
                const multiplier = 0.004;
                setActiveSlideFractionalIndex(mouseDown.originalFractionalIndex + multiplier * distanceX);

            }
        }
    }

    function handleMouseUp() {
        dragEnd();
    }

    function handleTouchEnd() {
        dragEnd()
    }

    function handleMouseLeave() {
        dragEnd();
    }

    function handleBlur() {
        dragEnd();
    }

    function handleSlideClick(index: number) {
        if (preventNextClick.current) {
            preventNextClick.current = false;
        } else {
            goToSlide(index);
        }
    }

    useEffect(() => {
        let animationFrame: number;

        function animateFractional() {
            if (autoControlFractional) {
                const distance = activeSlideIndex - activeSlideFractionalIndex;
                if (distance === 0) {
                    multiFrameCount.current = 0;
                    animationFrame = requestAnimationFrame(animateFractional);
                    return;
                }

                let framesDistanceCount = Math.ceil(Math.abs(distance));
                if (framesDistanceCount > multiFrameCount.current) {
                    multiFrameCount.current = framesDistanceCount;
                }
                if (multiFrameCount.current) {
                    framesDistanceCount = multiFrameCount.current;
                }

                const normalizedDistance = distance / framesDistanceCount;
                const multiplier = calculateSpeed(normalizedDistance)*framesDistanceCount;
                const baseVelocity = 0.07;

                setActiveSlideFractionalIndex(prev => {
                    const newVal = prev + baseVelocity * multiplier;
                    if (Math.abs(activeSlideIndex - newVal) < 0.002) {
                        multiFrameCount.current = 0;
                        return activeSlideIndex;
                    }
                    return newVal;
                });
            }
            animationFrame = requestAnimationFrame(animateFractional);
        }

        animationFrame = requestAnimationFrame(animateFractional);

        const handleWindowBlur = () => {
            handleBlur();
        };
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('blur', handleWindowBlur);
            cancelAnimationFrame(animationFrame);
        };
    }, [autoControlFractional, activeSlideIndex, activeSlideFractionalIndex]);

    return (
        <div
            className={styles.sliderPage}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            style={{ '--fractionalIndex': activeSlideFractionalIndex } as React.CSSProperties}
        >
            <div
                className={styles.backgroundImages}
                style={{ '--accentColor': slides[activeSlideIndex]?.accentColor } as React.CSSProperties}
            >
                {slides.map((slide, index) => (
                    <Image
                        height={2000}
                        width={800}
                        key={index}
                        src={slide.backgroundImage}
                        alt={slide.titleText + ' background image'}
                        className={index === activeSlideIndex ? styles.activeBackground : ''}
                    />
                ))}
                <div className={styles.backgroundGradientCover}></div>
            </div>
            <div className={styles.mainContentContainer}>
                <div className={styles.navBar}>
                    <div>Nav</div>
                    <div>Login</div>
                </div>
                <div className={styles.Carousel}>
                    <div className={styles.slideInfoContainer}>
                        <div className={styles.slideTitleContainer}>
                            <div className={styles.slideTitleList}>
                                {slides.map((slide, idx) => (
                                    <div className={styles.slideTitleItem} key={idx}>
                                        {slide.titleText}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.slideSubtitle}>
                            {slides[activeSlideIndex].subtitle}
                        </div>
                        <div className={styles.slideActions}>
                            <button
                                className={styles.exploreButton}
                                style={{ background: slides[activeSlideIndex]?.accentColor }}
                            >
                                Explore Now
                            </button>
                        </div>
                    </div>
                    <div className={styles.slidesContainer} onMouseDown={handleMouseDown} onTouchStartCapture={handleTouchStart}>
                        <div className={styles.slidesList}>
                            {slides.map((slide, index) => {
                                const isSmallSlide = index > activeSlideFractionalIndex + 1;
                                const isTransitionSlide =
                                    index >= activeSlideFractionalIndex && index <= activeSlideFractionalIndex + 1;
                                const transitionAmount = Math.max(0, Math.min(1, Math.abs(index - activeSlideFractionalIndex)));
                                const slideClasses = [
                                    styles.slide,
                                    isSmallSlide ? styles.smallSlide : '',
                                    isTransitionSlide ? styles.transitionSlide : ''
                                ].join(' ');

                                return (
                                    <div
                                        key={index}
                                        className={slideClasses}
                                        onClick={() => handleSlideClick(index)}
                                        style={{ '--transitionAmount': transitionAmount, '--accentColor': slide.accentColor } as React.CSSProperties}
                                    >
                                        <Image src={slide.slideImage} alt={slide.titleText} height={1000} width={500} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
