import "reflect-metadata";
import { createConnection, getConnection } from "typeorm";

import { User } from "./entity/User";
import { Note } from "./entity/Note";
import { SharedNote } from "./entity/SharedNote";

createConnection()
  .then(async (conn) => {
    // crud single table
    const u1 = await User.create({ username: "cynthia" }).save();
    await User.update({ id: u1.id }, { username: "tom" });
    await User.findOne({ username: "tom" });
    await User.find({ where: { username: "tom" } });
    await User.delete({ username: "tom" });

    // crud many to one
    const jolene = await User.create({ username: "jolene" }).save();
    const note = await Note.create({
      text: "hello",
      ownerId: jolene.id
    }).save();
    const notes = await Note.find({ ownerId: jolene.id });
    console.log(notes, "notes");

    // crud many to many
    const tim = await User.create({ username: "tim" }).save();
    await SharedNote.create({
      senderId: jolene.id,
      targetId: tim.id,
      noteId: note.id
    }).save();
    console.log("....");
    const notesSharedWithTim = await SharedNote.find({
      where: {
        targetId: tim.id
      },

      // shared note entity @PrimaryColumn: noteId
      // -> @JoinColumn: note
      relations: ["note"]
    });
    console.log("notesSharedWithTim", notesSharedWithTim, "notesSharedWithTim");

    // typeorm relations
    await User.findOne(
      { id: tim.id },
      { relations: ["notesSharedWithYou", "notesSharedWithYou.note"] }
    );
    console.log("____start____");

    await User.findOne(
      { id: jolene.id },
      {
        relations: [
          "notesYouShared",
          "notesYouShared.note",
          "notesSharedWithYou",
          "notesSharedWithYou.note"
        ]
      }
    );
    console.log("____end____");

    // get all notes jolene owns or was shared with him
    // in 1 sql query

    await conn
      .getRepository(Note)
      .createQueryBuilder("n")
      .leftJoin(SharedNote, "sn", 'sn."noteId" = n.id')
      .where('n."ownerId" = :ownerId', { ownerId: jolene.id })
      .getMany();
  })
  .then(() => process.exit())
  .catch((error) => console.log("error:", error, "error catch"));
