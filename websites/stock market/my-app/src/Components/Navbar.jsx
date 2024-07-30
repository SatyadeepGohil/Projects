import React, { useRef, useState, useEffect, createRef } from 'react';
import gsap from 'gsap';
import Contact from '../Pages/Market';
import { Link } from 'react-router-dom';

const Menu = () => {
    const items = [
    {
        name: "Home",
        color: "#f44336",
        href: "/"
    },
    {
        name: "Market",
        color: "#e91e63",
        href: '/market'
    },
    {
        name: "Analysis",
        color: "#9c27b0",
        href: "#"
    },
    {
        name: "Portofolio",
        color: "##673ab7",
        href: "#"
    },
    {
        name: "Tools",
        color: "#3f51b5",
        href: "#"
    },
];


    const $root = useRef()
    const $indicator1 = useRef()
    const $indicator2 = useRef()
    const $items = useRef(items.map(createRef))
    const [ active, setActive] = useState(0)

    const animate = () => {
        const menuOffset = $root.current.getBoundingClientRect()
        const activeItem = $items.current[active].current
        const {width,height,top,left} = 
        activeItem.getBoundingClientRect()

        const settings = {
            x: left - menuOffset.x,
            y: top - menuOffset.y,
            width: width,
            height: height,
            backgroundColor: items[active].color,
            ease: 'elastic.out(.7,.7)',
            duration: .8
        };

        gsap.to($indicator1.current, {
            ...settings,
        });

        gsap.to($indicator2.current, {
            ...settings,
            duration: 1
        });
    };

    useEffect(() => {
        animate();
        window.addEventListener('resize', animate);

        return () => {
            window.removeEventListener('resize', animate);
        };
    }, [active]);

    return (
        <div ref={$root} className='menu'>
            {items.map((item, index) => (
                    <Link
                        key={item.name}
                        ref={$items.current[index]}
                        className={`item ${active === index ? 'active' : ''}`}
                        onMouseEnter={() => {
                            setActive(index);
                        }} to={item.href ? item.href : undefined}>
                            {item.name}
                            </Link>
            ))}
            <div ref={$indicator1} className='indicator'></div>
            <div ref={$indicator2} className='indicator'></div>
        </div>
    );
};


export default Menu;