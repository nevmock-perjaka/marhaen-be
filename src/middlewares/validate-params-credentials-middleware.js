const validateParamsCredentials =
   (schema) =>
   (req, res, next) => {
      console.log(req.query);
      const validated = schema.validate(req.query, {
         abortEarly: false,
         errors: {
            wrap: {
               label: '',
            },
         },
         convert: true,
      });

      if (validated.error) {
         next(validated.error);
      } else {
         next();
      }
   };

export default validateParamsCredentials;