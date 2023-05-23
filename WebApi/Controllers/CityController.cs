using Microsoft.AspNetCore.Mvc;
using WebApi.Models;
using WebApi.Data.Repo;
using webapi.Interfaces;
using WebApi.Interfaces;
using WebApi.DTOs;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    public class CityController : BaseController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public CityController(IUnitOfWork uow, IMapper mapper)
        {
            this._uow = uow;
            this._mapper = mapper;
        }


        // GET api/city
        [HttpGet("")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCities()
        {            
            // throw new UnauthorizedAccessException();
            var cities = await _uow.CityRepository.GetCitiesAsync();

            // var citiesDTO = from c in cities
            //     select new CityDTO() {
            //         Id = c.Id,
            //         Name = c.Name,
            //     };

            var citiesDTO = _mapper.Map<IEnumerable<CityDTO>>(cities);

            return Ok(citiesDTO);
        }


        // POST api/City/Los Angeles  -- Post the data in JSON Format
        [HttpPost("post")]
        public async Task<IActionResult> AddCity(CityDTO cityDTO)
        {
            var city = _mapper.Map<City>(cityDTO);
            city.LastUpdatedBy = 1;
            city.LastUpdatedOn = DateTime.Now;
            // var city = new City {
            //     Name = cityDTO.Name,
            //     LastUpdatedBy = 1,
            //     LastUpdatedOn = DateTime.Now,
            // };

            _uow.CityRepository.AddCity(city);
            await _uow.SaveAsync();
            return StatusCode(201);
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityDTO cityDTO)
        {
            try {
                if (id != cityDTO.Id)
                {
                    return BadRequest("Update not Allowed");
                }

                var cityFromDb = await _uow.CityRepository.FindCity(id);

                if (cityFromDb == null)
                {
                    return BadRequest("Update not Allowed");
                }

                cityFromDb.LastUpdatedBy = 1;
                cityFromDb.LastUpdatedOn = DateTime.Now;

                _mapper.Map(cityDTO, cityFromDb);
                // throw new Exception("Could not");              
                await _uow.SaveAsync();
                return StatusCode(200);
            } catch {
                return StatusCode(500, "Some unknown error has occurred");
            }
        }

        [HttpPatch("updateByPatch/{id}")]
        public async Task<IActionResult> UpdateCityPatch(int id, JsonPatchDocument<City> cityToPatch)
        {
            var cityFromDb = await _uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            cityToPatch.ApplyTo(cityFromDb, ModelState);
            await _uow.SaveAsync();
            return StatusCode(200);
        }

        [HttpPut("updateCityName/{id}")]
        public async Task<IActionResult> UpdateCity(int id, CityUpdateDTO cityDTO)
        {            

            var cityFromDb = await _uow.CityRepository.FindCity(id);
            cityFromDb.LastUpdatedBy = 1;
            cityFromDb.LastUpdatedOn = DateTime.Now;

            _mapper.Map(cityDTO, cityFromDb);
            await _uow.SaveAsync();
            return StatusCode(200);
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            _uow.CityRepository.DeleteCity(id);
            await _uow.SaveAsync();
            return Ok(id);
        }
    }
}