import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const SlickCarousel = (props: any) => {
    const {
        slips,
        setCurrentIndex,
        currentIndex,
    } = props;

    const SlickSlider = Slider as unknown as React.FC<any>;
    const PrevArrow = (props: any) => {
        const { onClick } = props;
        setCurrentIndex(props.currentSlide)
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    left: 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
            >
                <ArrowBackIosNewIcon />
            </IconButton>
        );
    };

    const NextArrow = (props: any) => {
        const { onClick } = props;
        setCurrentIndex(props.currentSlide)
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    right: 2,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
            >
                <ArrowForwardIos />
            </IconButton>
        );
    };

    const settings = {
        // dots: true,
        initialSlide: currentIndex,
        infinite: slips.length > 1,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 4000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, position: "relative" }}>
            <SlickSlider {...settings}>
                {slips.map((slip: any, index: number) => (
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", height: 400 }} key={index}>
                        <img
                            src={slip.img_url}
                            alt={`slide-${index}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "12px",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                ))}
            </SlickSlider>
        </Box>
    );
};

export default SlickCarousel;