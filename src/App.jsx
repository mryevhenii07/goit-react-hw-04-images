import { useState, useEffect } from "react";
import SearchBar from "./components/Searchbar/Searchbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "services/api";

import ImageGallery from "components/ImageGallery/ImageGallery";
import Button from "components/Button/Button";
import Spinner from "components/Loader/Loader";
import Modal from "components/Modal/Modal";
import Loader from "react-loader-spinner";

import "App.module.css";

const App = () => {
  const [bigImageUrl, setBigImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageStatus, setImageStatus] = useState("loading");
  const onSearchHandle = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setImages([]);
  };

  useEffect(() => {
    //если ничего не ввели в инпут, то запрос не выполнится
    //searchQuery === null
    if (!searchQuery) {
      return;
    }

    setIsLoading(true);
    const fetchImagesGallery = async () => {
      const options = {
        searchQuery,
        currentPage,
      };
      try {
        const data = await api.fetchImages(options);
        if (data.data.total === 0) {
          toast.error("Нет совпадений с запросом");
          return;
        }
        const filteredData = data.data.hits.map((hit) => {
          return {
            id: hit.id,
            webformatURL: hit.webformatURL,
            largeImageURL: hit.largeImageURL,
          };
        });
        setImages((prevImages) => [...prevImages, ...filteredData]);
      } catch (err) {
        console.log(err);
        toast.error("Ошибка");
      } finally {
        setIsLoading(false);
      }
    };
    fetchImagesGallery();
  }, [currentPage, searchQuery]);

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const onImageClick = (url) => {
    setBigImageUrl(url);
    toggleModal();
    setImageStatus("loading");
  };
  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };
  const onImageLoaded = () => {
    setImageStatus("loaded");
  };

  const shouldRenderLoadMoreBtn = images.length > 0 && !isLoading;
  return (
    <div>
      {showModal && (
        <Modal onClose={toggleModal}>
          {imageStatus === "loading" && (
            <Loader type="ThreeDots" color="#fff" height={80} width={80} />
          )}
          <img src={bigImageUrl} alt="" onLoad={onImageLoaded} />
        </Modal>
      )}

      <SearchBar onSubmit={onSearchHandle} />
      <ImageGallery images={images} onClick={onImageClick} />
      {isLoading && <Spinner />}
      {shouldRenderLoadMoreBtn && <Button onClick={loadMore} />}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default App;
