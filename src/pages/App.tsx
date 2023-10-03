import React, {useEffect, useState} from "react";
import {
    Container,
    LogoContainer,
    CardsContainer,
    Logo,
    ContainerButton,
    Button
} from "./App.styles";
import logo from "../assets/img/logo.png";
import totoro from "../assets/img/totoro.png";

import {createBoard} from "../Utils/setup";
import {shuffleArray} from "../Utils/utils";

import {CardType} from "../Utils/setup";
import Card from "../Card/Card";

const App = () => {
    const timeout = 1000;
    const [cards, setCards] = useState<CardType[]>(shuffleArray(createBoard()));
    const [gameWon, setGameWon] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [clickedCard, setClickedCard] = useState<undefined | CardType>(
        undefined
    );

    // Эффект для проверки выигрыша при совпадении всех пар карт
    // Effect to check for a win when all pairs of cards match
    useEffect(
        () => {
            if (matchedPairs === cards.length / 2) {
                setGameWon(true);
            }
        },
        [matchedPairs, cards] // Include 'cards' as a dependency
    );

// Функция для обновления страницы
// Function to refresh the page
    function refreshPage() {
        window.location.reload();
    }

// Обработчик клика по карточке
// Click handler for cards
    const handleCardClick = (currentClickedCard: CardType) => {
        // Поворачиваем карту
        // Flip the card
        setCards(prev =>
            prev.map(
                card =>
                    card.id === currentClickedCard.id
                        ? {...card, flipped: true, clickable: false}
                        : card
            )
        );

        // Если это первая карта, оставляем ее повернутой
        // If it's the first card, leave it flipped
        if (!clickedCard) {
            setClickedCard({...currentClickedCard});
            return;
        }

        // Проверяем, совпадают ли карточки
        // Check if the cards match
        if (
            clickedCard.matchingCardId === currentClickedCard.id ||
            clickedCard.id === currentClickedCard.matchingCardId
        ) {
            // Если совпали, увеличиваем счетчик пар и отключаем их для клика
            // If they match, increase the pair count and disable them for clicking
            setMatchedPairs(prev => prev + 1);
            setCards(prev =>
                prev.map(
                    card =>
                        card.id === clickedCard.id || card.id === currentClickedCard.id
                            ? {...card, clickable: false}
                            : card
                )
            );
            setClickedCard(undefined);
            return;
        }

        // Если не совпали, переворачиваем обратно через заданное время
        // If they don't match, flip them back after a specified time
        setTimeout(() => {
            setCards(prev =>
                prev.map(
                    card =>
                        card.id === clickedCard.id || card.id === currentClickedCard.id
                            ? {...card, flipped: false, clickable: true}
                            : card
                )
            );
        }, timeout);

        setClickedCard(undefined);
    };

    return (
        <Container>
            <LogoContainer>
                <Logo src={logo} alt="logo"/>
                {gameWon && (
                    <ContainerButton>
                        <img src={totoro} alt="totoro"/>
                        <Button type="submit" onClick={refreshPage}>
                            New game
                        </Button>
                    </ContainerButton>
                )}
            </LogoContainer>
            <CardsContainer>
                {cards.map(card => (
                    <Card key={card.id} callback={handleCardClick} card={card}/>
                ))}
            </CardsContainer>
        </Container>
    );
};

export default App;
