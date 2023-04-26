import type { PostComment } from "@/@types/model/post";
import { Divider, Grid, Typography } from "@mui/material";
import type { FC } from "react";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getTimeAgo } from "@/helpers/utils";

export interface CommentProps {
    comment: PostComment;
}

const Comment: FC<CommentProps> = ({ comment }) => {
    return (
        <Grid
            item
            xs={12}
            pl={{
                xs: 2,
                md: 8,
            }}
        >
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant="subtitle2" component="span">
                        <PersonIcon
                            fontSize="small"
                            color="secondary"
                            sx={{ verticalAlign: "sub", mr: 1 }}
                        />
                        {[
                            comment.author.firstName,
                            comment.author.lastName,
                        ].join(" ") || comment.author.email}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2" component="span">
                        {getTimeAgo(
                            new Date(comment.createdAt),
                            navigator.language,
                        )}
                        <CalendarMonthIcon
                            fontSize="small"
                            color="primary"
                            sx={{ verticalAlign: "sub", ml: 1 }}
                        />
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" component="p">
                {comment.content}
            </Typography>
        </Grid>
    );
};

export default Comment;
