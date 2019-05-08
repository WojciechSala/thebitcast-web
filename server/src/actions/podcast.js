import notifs from "../config/notifications";
import Joi from "joi";
import db from "../config/db";
import fs from "fs";
import isMp3 from "is-mp3";
import thumbnails from "../config/thumbnails";
import dateTime from "node-datetime";
import mp3Duration from "mp3-duration";
import timeFormat from "hh-mm-ss";

function getActualTime() {
  const dt = dateTime.create();
  return dt.format("Y-m-d H:M:S");
}

async function abortUploading(podcastID) {
  let sql = "DELETE pocast WHERE ID=" + podcastID;
  await db.query(sql);
  fs.unlinkSync(__dirname + "/../../public/podcasts/mp3/" + podcastID + ".mp3");
  fs.unlinkSync(__dirname + "/../../public/podcasts/mp3/" + podcastID + ".jpg");
}

function getMp3Duration(mp3) {
  return new Promise(resolve => {
    mp3Duration(mp3, (err, duration) => {
      if (err) resolve(false);
      resolve(duration);
    });
  });
}

function checkCategoryExist(categoryID) {
  return new Promise(async resolve => {
    let sql = "SELECT * FROM categories WHERE ID=" + categoryID;
    let result = await db.query(sql);
    if (!result) resolve(false);
    else resolve(true);
  });
}

function upload(data) {
  return new Promise(async resolve => {
    if (!data.region) data.region = "NULL";
    let sql =
      "INSERT INTO podcasts (ID, creator_ID, category_ID, upload_date, length, title, description, region_ID) VALUES" +
      " (NULL, " +
      data.creatorID +
      ", " +
      data.category +
      ', "' +
      getActualTime() +
      '", "' +
      data.length +
      '", "' +
      data.title +
      '", "' +
      data.desc +
      '", ' +
      data.region +
      ");SELECT @@IDENTITY As ID;";

    let result = await db.query(sql);
    if (!result) resolve(false);
    else resolve(result[1][0].ID);
  });
}

export default {
  async checkUpload(req, res) {
    if (!req.isAuthenticated()) return res.json(notifs.notLogged);

    //Validation
    const mp3Encoded = req.body.mp3;
    const thumbnailEncoded = req.body.thumbnail;

    const data = {
      desc: req.body.desc,
      title: req.body.title,
      tags: req.body.tags,
      category: req.body.category,
      region: req.user.region_ID,
      creatorID: req.user.ID,
      length: "00:00:00"
    };

    const DATA_SCHEMA = Joi.object().keys({
      desc: Joi.string().max(2500),
      title: Joi.string()
        .min(5)
        .max(50)
        .required(),
      category: Joi.number().required(),
      tags: Joi.any(),
      region: Joi.number(),
      creatorID: Joi.any(),
      length: Joi.any()
    });

    if (Joi.validate(data, DATA_SCHEMA).error)
      return res.json(notifs.incorrectData);
    if (!mp3Encoded) return res.json(notifs.incorrectData);

    for (let i = 0; i < data.tags.length; i++) {
      const TAG_SCHEMA = Joi.string()
        .min(1)
        .max(50);
      if (Joi.validate(data.tags[i], TAG_SCHEMA).error)
        return res.json(notifs.incorrectData);
    }

    if (!(await checkCategoryExist(data.category)))
      return res.json(notifs.incorrectData);

    //Decoding
    let mp3Decoded = new Buffer.from(mp3Encoded, "base64");
    let thumbnailDecoded = false;
    if (thumbnailEncoded)
      thumbnailDecoded = new Buffer.from(thumbnailEncoded, "base64");

    //mp3 and thumbnail validation
    if (!isMp3(mp3Decoded)) return res.json(notifs.invalidFiles);
    if (thumbnailDecoded && !thumbnails.checkThumbnail(thumbnailDecoded))
      return res.json(notifs.invalidFiles);

    const mp3Duration = await getMp3Duration(mp3Decoded);
    if (!mp3Duration) return res.json(notifs.invalidFiles);

    data.length = timeFormat.fromS(Math.floor(mp3Duration), "HH:MM");

    //Upload
    const podcastID = await upload(data);
    if (!podcastID) return res.json(notifs.dbError);

    //Save mp3 and thumbnail
    fs.writeFile(
      __dirname + "/../../public/podcasts/mp3/" + podcastID + ".mp3",
      mp3Decoded,
      err => {
        if (err) {
          abortUploading(podcastID);
          return res.json(notifs.invalidFiles);
        } else {
          if (thumbnailDecoded) {
            fs.writeFile(
              __dirname +
                "/../../public/podcasts/thumbnails/" +
                podcastID +
                ".jpg",
              thumbnailDecoded,
              err1 => {
                if (err1) {
                  abortUploading(podcastID);
                  return res.json(notifs.invalidFiles);
                } else {
                  return res.json(notifs.podcastUploaded);
                }
              }
            );
          } else {
            return res.json(notifs.podcastUploaded);
          }
        }
      }
    );
  }
};
