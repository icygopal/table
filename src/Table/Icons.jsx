import axios, { Axios } from "axios";

export const IconAngleArrowDown = ({ className }) => (
	<svg
	  className={`cicon ${className}`}
	  width="20"
	  height="20"
	  viewBox="0 0 20 20"
	  fill="none"
	  xmlns="http://www.w3.org/2000/svg"
	>
	  <path
		fillRule="evenodd"
		clipRule="evenodd"
		d="M9.39899 12.8938L5.99988 9.49468L7.20165 8.29291L9.99988 11.0911L12.7981 8.29291L13.9999 9.49468L10.6008 12.8938C10.2689 13.2257 9.73085 13.2257 9.39899 12.8938Z"
		fill="currentColor"
	  />
	</svg>
  );

  export const IconAngleArrowTop = ({ className }) => (
    <svg
      className={`cicon ${className}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.601 8.10621L14.0001 11.5053L12.7984 12.7071L10.0001 9.90886L7.20189 12.7071L6.00012 11.5053L9.39924 8.10621C9.7311 7.77435 10.2691 7.77435 10.601 8.10621Z"
        fill="currentColor"
      />
    </svg>
  );

  function jsonToQueryParams(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  export function getFromToPlace(params) {
    const obj = { limit: 10 }
    if (params)
      obj.searchTerm = params
    let url = 'carrier/getTMSCustomers';
    url = obj ? "https://devapi.app.portpro.io/"+ url + "?" + jsonToQueryParams(obj) : url;
    console.log(localStorage.getItem('token'))
    return new Promise(async (resolve, reject) => {
        const config = {
            headers: { "Content-type": "application/json",'Authorization':  localStorage.getItem('token') }
        };
        console.log(config)
        // const data = await axios.get( 
        //     url,
        //   config
        // )
        // console.log(data)
        
        axios.get( 
            url,
          config
        ).then((result) => {
            console.log(result)
          let customers = [];
          if (result.data && result.data.data) {
            customers = result.data.data.map((customer) => 
              ({ value: customer._id, label: customer.company_name })
            );
          }
          resolve(customers);
        }).catch((err)=>console.log(err));
    
    })
  }