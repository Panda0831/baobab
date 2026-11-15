import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import logoBaobab from "../baobab-site/assets/logo-baobab.png";
import { DURATION, EASE } from "../motion";

const links = [
    ["Accueil", "#accueil"],
    ["Solutions", "#services"],
    ["Plateforme", "#plateforme"],
    ["À propos", "#about"],
    ["Méthode", "#methode"],
    ["Équipe", "#equipe"],
    ["Contact", "#contact"],
];

const Navbar: React.FC = () => {
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState("#accueil");
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const { scrollY, scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, restDelta: 0.001 });

    useMotionValueEvent(scrollY, "change", value => setScrolled(value > 14));

    useEffect(() => {
        const sections = links
            .map(([, href]) => document.querySelector(href))
            .filter((section): section is Element => Boolean(section));
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible?.target.id) setActive(`#${visible.target.id}`);
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.15, 0.35] },
        );
        sections.forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // Ferme le menu mobile dès qu'un lien est activé, au clavier comme au clic.
    useEffect(() => {
        const close = () => setOpen(false);
        window.addEventListener("hashchange", close);
        return () => window.removeEventListener("hashchange", close);
    }, []);

    // Échap ferme le menu et rend le focus au bouton.
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onResize = () => {
            if (window.matchMedia("(min-width: 861px)").matches) setOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("resize", onResize);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("resize", onResize);
        };
    }, [open]);

    // Déplace le focus dans le menu ouvert, sans surprendre au chargement.
    useEffect(() => {
        if (open) menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, [open]);

    return (
        <motion.nav
            className={`navbar${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}`}
            aria-label="Navigation principale"
            initial={reduceMotion ? false : { y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: EASE }}
        >
            <div className="container navbar-inner">
                <a href="#accueil" className="logo" aria-label="Baobab, accueil" onClick={() => setOpen(false)}>
                    <img className="logo-mark" src={logoBaobab} alt="" />
                    <span className="logo-word">
                        Baobab<span aria-hidden="true">.</span>
                    </span>
                </a>
                <button
                    ref={toggleRef}
                    type="button"
                    className="nav-toggle"
                    aria-expanded={open}
                    aria-controls="menu-principal"
                    aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                    onClick={() => setOpen(value => !value)}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
                <ul id="menu-principal" ref={menuRef} className="nav-links">
                    {links.map(([label, href], index) => (
                        <motion.li
                            key={href}
                            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: reduceMotion ? 0 : DURATION.short,
                                delay: reduceMotion ? 0 : 0.1 + index * 0.04,
                                ease: EASE,
                            }}
                            whileHover={reduceMotion ? undefined : { y: -2 }}
                        >
                            <a
                                href={href}
                                className={`nav-link${active === href ? " is-active" : ""}`}
                                aria-current={active === href ? "location" : undefined}
                                onClick={() => setOpen(false)}
                            >
                                {label}
                                {active === href && index < links.length - 1 && (
                                    <motion.span
                                        className="nav-underline"
                                        layoutId="nav-underline"
                                        aria-hidden="true"
                                        transition={
                                            reduceMotion
                                                ? { duration: 0 }
                                                : { type: "spring", stiffness: 380, damping: 32, mass: 0.6 }
                                        }
                                    />
                                )}
                            </a>
                        </motion.li>
                    ))}
                </ul>
            </div>
            <motion.span className="scroll-progress" aria-hidden="true" style={{ scaleX: progress }} />
        </motion.nav>
    );
};

export default Navbar;
