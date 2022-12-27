import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Carousel, Spin, message, Select, Rate, Pagination, Image } from "antd";
// import Image from "next/image";
import { setDelay } from "../../../utils/setDelay";
import CourseCard from "../../../components/cards/CourseCard";
import Link from "next/link";
import { Breadcrumb, Dropdown, Label, SearchBox, Slider, PrimaryButton, DefaultButton } from "@fluentui/react";
import styles from '../../../styles/components/category/[categorySlug]/index.module.scss';

const CategoryPage = () => {
  // router
  const router = useRouter();
  const { categorySlug } = router.query;

  // states
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({});
  const [banners, setBanners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ name: '', price: { lower: 0, upper: 0 }, durationInfo: -1 });
  const [sortBy, setSortBy] = useState({ which: '', mode: 0 }); // mode: 1: asc | -1: desc

  // functions
  const onSearchClick = async () => {
    try {
      if ((filters.name !== '' || filters.star !== 0 || filters.durationInfo !== -1 ||
        filters.price.lower !== 0 || filters.price.upper !== 0 ||
        sortBy.which !== '' || sortBy.mode !== 0)) {
        setLoading(true);

        let query = {};
        query['limit'] = 16;
        query['page'] = currentPage;
        query['category'] = category?._id;
        if (filters.name !== '') query['name'] = filters.name;
        if (filters.durationInfo !== -1) query['duration'] = filters.durationInfo * 3600;
        if (filters.price.lower !== 0 || filters.price.upper !== 0) {
          if (filters.price.lower !== 0) query['lowerPrice'] = filters.price.lower; else query['lowerPrice'] = 0;
          if (filters.price.upper !== 0) query['upperPrice'] = filters.price.upper; else query['upperPrice'] = 0;
        }
        if (sortBy.which !== '') query['sortBy'] = sortBy.which.split('_')[0];
        if (sortBy.mode !== 0) query['sortByMode'] = sortBy.mode;

        const queryString = new URLSearchParams(query).toString();

        const { data: dataCourses } = await axios.get(
          `/api/course/public?${queryString}`
        );
        setCourses(dataCourses?.data[0]?.paginatedResults);
        setTotal(dataCourses?.data[0]?.totalCount[0]?.count || 0);

        setLoading(false);
      }
      else {
        const queryString = new URLSearchParams({
          category: category?._id,
          page: 1,
          limit: 16,
        }).toString();

        const { data: dataCourses } = await axios.get(
          `/api/course/public?${queryString}`
        );
        setCourses(dataCourses?.data[0]?.paginatedResults);
        setTotal(dataCourses?.data[0]?.totalCount[0]?.count || 0);
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi tìm kiếm. Chi tiết: ${error.message}`);
      console.log('error onSearchClick: ', error);
      setLoading(false);
    }
  }

  const onResetClick = () => {
    try {
      setFilters({ name: '', price: { lower: 0, upper: 0 }, durationInfo: -1 });
      setSortBy({ which: '', mode: 0 });
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi reset. Chi tiết: ${error.message}`);
      console.log('error onResetClick: ', error);
      setLoading(false);
    }
  }

  const fetchData = async () => {
    try {
      if (router.isReady) {
        setLoading(true);

        const { data: dataCategories } = await axios.get(
          `/api/category/public/${categorySlug}`
        );
        setCategory(dataCategories.data);

        const queryString = new URLSearchParams({
          category: dataCategories?.data?._id,
          page: currentPage,
          limit: 16,
        }).toString();

        const { data: dataCourses } = await axios.get(
          `/api/course/public?${queryString}`
        );
        setCourses(dataCourses?.data[0]?.paginatedResults);
        setTotal(dataCourses?.data[0]?.totalCount[0]?.count || 0);
        setLoading(false);
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy thông tin phân loại. Chi tiết: ${error.message}`);
      console.log('error fetchData: ', error);
      setLoading(false);
    }
  }

  const fetchBanners = async () => {
    try {
      setLoading(true)
      if (router.isReady) {
        // get category detail to get _id
        const { data: dataCategory } = await axios.get(
          `/api/category/public/${categorySlug}`
        );

        // get banners of that category
        const query = { type: 'category', categoryId: dataCategory.data._id };
        const queryString = new URLSearchParams(query).toString();
        const { data: dataBanners } = await axios.get(
          `/api/banner/public?${queryString}`
        );

        setBanners(dataBanners.data);
        setLoading(false);
      }
    }
    catch (error) {
      message.error(`Xảy ra lỗi khi lấy thông tin banners. Chi tiết: ${error.message}`);
      console.log('error fetchBanners: ', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [categorySlug, currentPage]);

  useEffect(() => {
    fetchBanners();
  }, [categorySlug])

  return (
    <div
      style={{ padding: '8px' }}
    >
      <div
        className={styles.container}
        style={{ padding: '12px 24px', width: '1280px' }}
      >
        <div
          className={styles.container_breadcrumb}
        >
          <Breadcrumb
            items={[
              { text: 'Home', key: '/', onClick: () => router.push('/') },
              { text: 'Phân loại', key: '/category' },
              { text: `${category?.name}`, key: `/category/${category?.slug}`, onClick: () => router.push(`/category/${category?.slug}`) },
            ]}
          />
        </div>
        {
          loading
            ? (
              <Spin
                spinning={true}
              />
            )
            : (
              <span
                className={styles.h2}
                style={{ marginTop: '16px' }}
              >
                <h2
                  style={{ color: '#ff6147' }}
                >
                  {category?.name}
                </h2>
              </span>
            )
        }
        <div
          className={styles.container_carousel}
        >
          <Carousel autoplay={true} effect='fade'>
            {/* <Image
              alt='carousel_1'
              width={1280}
              height={156}
              src={`/carousels/carousel_${categorySlug}.svg`}
            /> */}
            {
              banners?.map((banner, index) => {
                return (
                  <Image
                    key={`catebanner_${index}`}
                    src={banner?.image?.Location}
                    width={1232}
                    height={156}
                    preview={false}
                    style={{
                      width: '-webkit-fill-available',
                      height: '-webkit-fill-available'
                    }}
                  />
                )
              })
            }
          </Carousel>
        </div>
        <div
          className={styles.container_body}
        >
          <h2
            className={styles.h2}
            style={{ marginTop: '12px', fontSize: '28px' }}
          >
            Tất cả
          </h2>
          <div
            className={`${styles.container_body_tools} ${styles.d_flex_col}`}
            style={{ justifyContent: 'space-between', gap: '8px' }}
          >
            <div
              className={`${styles.container_body_tools_top} ${styles.d_flex_row}`}
            >
              <div
                className={styles.container_body_tools_top_name}
              >
                <Label>Tìm kiếm từ khóa</Label>
                <SearchBox
                  placeholder='Nhập từ khóa...'
                  showIcon={true}
                  value={filters.name}
                  onChange={(_, value) => setFilters({ ...filters, name: value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div
                className={styles.container_body_tools_top_sort}
              >
                <Dropdown
                  label="Sắp xếp theo"
                  placeholder="Lựa chọn"
                  options={[
                    { key: 'name_asc', text: 'A-Z' },
                    { key: 'name_desc', text: 'Z-A' },
                    { key: 'star_asc', text: 'Số sao tăng dần' },
                    { key: 'star_desc', text: 'Số sao giảm dần' },
                    { key: 'courseDurationSum_asc', text: 'Thời lượng tăng dần' },
                    { key: 'courseDurationSum_desc', text: 'Thời lượng giảm dần' },
                  ]}
                  selectedKey={sortBy.which}
                  onChange={(event, item) => setSortBy({
                    ...sortBy,
                    which: item.key,
                    mode: item.key.includes('asc') ? 1 : -1,
                  })}
                />
              </div>
            </div>
            <div
              className={`${styles.container_body_tools_bottom} ${styles.d_flex_row}`}
              style={{ justifyContent: 'space-between', gap: '28px' }}
            >
              <div
                className={styles.container_body_tools_bottom_duration}
              >
                <Dropdown
                  label="Lọc theo thời lượng"
                  placeholder="Chọn thời lượng"
                  options={[6, 4, 2, 1, 0.5, 0.035278].map(number => {
                    return { key: number, text: `> ${number} giờ` }
                  })}
                  selectedKey={filters.durationInfo}
                  onChange={(event, item) => setFilters({ ...filters, durationInfo: item.key })}
                />
              </div>
              <div
                className={styles.container_body_tools_bottom_price}
              >
                <Slider
                  className="filter_slider"
                  label="Lọc theo mức giá"
                  ranged={true}
                  showValue={true}
                  min={0}
                  max={500000}
                  step={10000}
                  lowerValue={filters.price.lower}
                  onChange={(_, range) => {
                    let price = {};
                    price.lower = range[0];
                    price.upper = range[1];
                    setFilters({ ...filters, price });
                  }}
                />
              </div>
              <div
                className={`${styles.container_body_tools_bottom_button} ${styles.d_flex_row}`}
              >
                <div
                  className={styles.container_body_tools_bottom_button_reset}
                >
                  <DefaultButton
                    text='Reset'
                    onClick={onResetClick}
                    style={{ width: '100%' }}
                  />
                </div>
                <div
                  className={styles.container_body_tools_bottom_button_search}
                >
                  <PrimaryButton
                    text='Tìm kiếm'
                    onClick={onSearchClick}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.container_body_card}
          >
            <p
              style={{ margin: '20px 0px 16px 0px', fontSize: '18px' }}
            ><b>Kết quả</b></p>
            <div
              className={styles.container_body_card_courses}
            >
              {
                courses?.length
                  ? (
                    courses?.map((course, index) => {
                      return (
                        <Link key={index} href={`/course/${course?.slug}`}>
                          <CourseCard
                            course={course}
                            index={index}
                          />
                        </Link>
                      )
                    })
                  )
                  : (
                    <p><i>Không có dữ liệu</i></p>
                  )
              }
            </div>
          </div>
          <div
            className={styles.container_body_pagination}
          >
            <Pagination
              current={currentPage}
              pageSize={16}
              total={total}
              onChange={(page, pagesize) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

export default CategoryPage;